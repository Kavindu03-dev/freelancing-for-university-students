import User from '../models/User.js';
import Service from '../models/Service.js';
import Post from '../models/Post.js';
import Order from '../models/Order.js';
import PDFDocument from 'pdfkit';

// @desc    Get student analytics for staff dashboard
// @route   GET /api/staff/student-analytics
// @access  Private (Staff only)
export const getStudentAnalytics = async (req, res) => {
  try {
    // Verify the user is university staff
    if (req.user.userType !== 'universityStaff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only university staff can access this endpoint.'
      });
    }

    // Get student statistics
    const totalStudents = await User.countDocuments({ userType: 'freelancer' });
    const verifiedStudents = await User.countDocuments({ 
      userType: 'freelancer', 
      isVerified: true 
    });
    const pendingVerification = await User.countDocuments({ 
      userType: 'freelancer', 
      isVerified: false 
    });

    // Get project statistics
    const activeProjects = await Order.countDocuments({ 
      status: { $in: ['Pending', 'Payment Confirmed', 'In Progress', 'Review', 'Revision'] }
    });
    const completedProjects = await Order.countDocuments({ 
      status: 'Completed' 
    });

    // Calculate total revenue from completed projects
    const revenueData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Get detailed student list with their performance data
    const students = await User.aggregate([
      { $match: { userType: 'freelancer' } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'freelancerId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          projects: { $size: '$orders' },
          revenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$orders',
                    cond: { $eq: ['$$this.status', 'Completed'] }
                  }
                },
                as: 'order',
                in: '$$order.totalAmount'
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          university: 1,
          degreeProgram: 1,
          gpa: 1,
          isVerified: 1,
          projects: 1,
          revenue: 1,
          createdAt: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 50 } // Limit to top 50 students by revenue
    ]);

    // Format student data for frontend
    const formattedStudents = students.map(student => ({
      id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      university: student.university || 'Not specified',
      degreeProgram: student.degreeProgram || 'Not specified',
      gpa: student.gpa || 'Not specified',
      status: student.isVerified ? 'Verified' : 'Pending',
      projects: student.projects,
      revenue: student.revenue || 0
    }));

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          verifiedStudents,
          pendingVerification,
          activeProjects,
          completedProjects,
          totalRevenue
        },
        students: formattedStudents
      }
    });
  } catch (error) {
    console.error('Error fetching student analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student analytics',
      error: error.message
    });
  }
};

// @desc    Get verification requests for staff
// @route   GET /api/staff/verification-requests
// @access  Private (Staff only)
export const getVerificationRequests = async (req, res) => {
  try {
    // Verify the user is university staff
    if (req.user.userType !== 'universityStaff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only university staff can access this endpoint.'
      });
    }

    // Get pending verification requests (students who are not verified)
    const verificationRequests = await User.find({
      userType: 'freelancer',
      isVerified: false
    })
    .select('firstName lastName email university degreeProgram gpa createdAt')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: verificationRequests
    });
  } catch (error) {
    console.error('Error fetching verification requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification requests',
      error: error.message
    });
  }
};

// @desc    Verify a student (approve verification request)
// @route   PUT /api/staff/verify-student/:id
// @access  Private (Staff only)
export const verifyStudent = async (req, res) => {
  try {
    // Verify the user is university staff
    if (req.user.userType !== 'universityStaff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only university staff can access this endpoint.'
      });
    }

    const { id } = req.params;

    const student = await User.findById(id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.userType !== 'freelancer') {
      return res.status(400).json({
        success: false,
        message: 'User is not a student'
      });
    }

    if (student.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Student is already verified'
      });
    }

    // Update student verification status
    student.isVerified = true;
    await student.save();

    res.json({
      success: true,
      message: 'Student verified successfully',
      data: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        isVerified: student.isVerified
      }
    });
  } catch (error) {
    console.error('Error verifying student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify student',
      error: error.message
    });
  }
};

// @desc    Export student analytics as PDF
// @route   GET /api/staff/export-analytics
// @access  Private (Staff only)
export const exportAnalyticsPDF = async (req, res) => {
  try {
    // Verify the user is university staff
    if (req.user.userType !== 'universityStaff') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only university staff can access this endpoint.'
      });
    }

    // Get student statistics
    const totalStudents = await User.countDocuments({ userType: 'freelancer' });
    const verifiedStudents = await User.countDocuments({ 
      userType: 'freelancer', 
      isVerified: true 
    });
    const pendingVerification = await User.countDocuments({ 
      userType: 'freelancer', 
      isVerified: false 
    });

    // Get project statistics
    const activeProjects = await Order.countDocuments({ 
      status: { $in: ['Pending', 'Payment Confirmed', 'In Progress', 'Review', 'Revision'] }
    });
    const completedProjects = await Order.countDocuments({ 
      status: 'Completed' 
    });

    // Calculate total revenue from completed projects
    const revenueData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Get detailed student list with their performance data
    const students = await User.aggregate([
      { $match: { userType: 'freelancer' } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'freelancerId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          projects: { $size: '$orders' },
          revenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$orders',
                    cond: { $eq: ['$$this.status', 'Completed'] }
                  }
                },
                as: 'order',
                in: '$$order.totalAmount'
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          university: 1,
          degreeProgram: 1,
          gpa: 1,
          isVerified: 1,
          projects: 1,
          revenue: 1,
          createdAt: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 50 } // Limit to top 50 students by revenue
    ]);

    // Create PDF document with better margins
    const doc = new PDFDocument({ 
      margin: 40,
      size: 'A4'
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="student-analytics-${new Date().toISOString().split('T')[0]}.pdf"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x, y, width, height, radius, fillColor) => {
      doc.save();
      doc.fillColor(fillColor);
      doc.roundedRect(x, y, width, height, radius);
      doc.fill();
      doc.restore();
    };

    // Helper function to draw gradient background
    const drawGradientBackground = () => {
      const gradient = doc.linearGradient(0, 0, 0, 150);
      gradient.stop(0, '#667eea');
      gradient.stop(1, '#764ba2');
      doc.fillColor(gradient);
      doc.rect(0, 0, doc.page.width, 150);
      doc.fill();
    };

    // Draw header with gradient background
    drawGradientBackground();

    // Add logo/icon placeholder (you can replace with actual logo)
    doc.save();
    doc.fillColor('white');
    doc.circle(60, 60, 25);
    doc.fill();
    doc.fillColor('#667eea');
    doc.fontSize(20);
    doc.font('Helvetica-Bold');
    doc.text('FH', 50, 50, { align: 'center' });
    doc.restore();

    // Add title with shadow effect
    doc.save();
    doc.fillColor('rgba(0,0,0,0.1)');
    doc.fontSize(32);
    doc.font('Helvetica-Bold');
    doc.text('Student Analytics Report', 105, 45);
    doc.restore();

    doc.fillColor('white');
    doc.fontSize(32);
    doc.font('Helvetica-Bold');
    doc.text('Student Analytics Report', 103, 43);

    // Add subtitle
    doc.fontSize(14);
    doc.font('Helvetica');
    doc.fillColor('rgba(255,255,255,0.9)');
    doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })} at ${new Date().toLocaleTimeString()}`, 103, 85);

    // Move to content area
    doc.moveDown(8);

    // Add summary statistics with beautiful cards
    doc.fontSize(20);
    doc.font('Helvetica-Bold');
    doc.fillColor('#2D3748');
    doc.text('Summary Statistics', 40, 180);
    doc.moveDown(1);

    const statsData = [
      { label: 'Total Students', value: totalStudents, icon: 'USERS', color: '#4299E1' },
      { label: 'Verified Students', value: verifiedStudents, icon: 'CHECK', color: '#48BB78' },
      { label: 'Pending Verification', value: pendingVerification, icon: 'CLOCK', color: '#ED8936' },
      { label: 'Active Projects', value: activeProjects, icon: 'ROCKET', color: '#9F7AEA' },
      { label: 'Completed Projects', value: completedProjects, icon: 'TARGET', color: '#38B2AC' },
      { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: 'MONEY', color: '#F6AD55' }
    ];

    // Create beautiful stats cards in 2x3 grid
    let cardX = 40;
    let cardY = 220;
    const cardWidth = 160;
    const cardHeight = 80;
    const cardSpacing = 20;

    statsData.forEach((stat, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = cardX + (col * (cardWidth + cardSpacing));
      const y = cardY + (row * (cardHeight + cardSpacing));

      // Draw card background with shadow
      doc.save();
      doc.fillColor('rgba(0,0,0,0.05)');
      doc.roundedRect(x + 2, y + 2, cardWidth, cardHeight, 8);
      doc.fill();
      doc.restore();

      // Draw main card
      drawRoundedRect(x, y, cardWidth, cardHeight, 8, '#FFFFFF');
      
      // Add border
      doc.save();
      doc.strokeColor(stat.color);
      doc.lineWidth(2);
      doc.roundedRect(x, y, cardWidth, cardHeight, 8);
      doc.stroke();
      doc.restore();

             // Add icon (using simple symbols instead of emojis)
       doc.fontSize(10);
       doc.font('Helvetica-Bold');
       doc.fillColor(stat.color);
       
       // Use simple symbols that render properly
       let iconText = '';
       switch(stat.icon) {
         case 'USERS': iconText = ''; break;
         case 'CHECK': iconText = ''; break;
         case 'CLOCK': iconText = ''; break;
         case 'ROCKET': iconText = ''; break;
         case 'TARGET': iconText = ''; break;
         case 'MONEY': iconText = ''; break;
         default: iconText = '•';
       }
       doc.text(iconText, x + 15, y + 15);

      // Add value
      doc.fontSize(18);
      doc.font('Helvetica-Bold');
      doc.fillColor('#2D3748');
      doc.text(stat.value.toString(), x + 15, y + 35);

      // Add label
      doc.fontSize(10);
      doc.font('Helvetica');
      doc.fillColor('#718096');
      doc.text(stat.label, x + 15, y + 55);
    });

    // Move to student data section
    doc.moveDown(12);

         // Add student data section with beautiful header
     doc.fontSize(20);
     doc.font('Helvetica-Bold');
     doc.fillColor('#2D3748');
     doc.text('Top Students by Revenue', 40, 480);
     doc.moveDown(1);

    if (students.length === 0) {
      // Draw empty state card
      drawRoundedRect(40, 520, doc.page.width - 80, 100, 12, '#F7FAFC');
      doc.fontSize(16);
      doc.font('Helvetica');
      doc.fillColor('#718096');
      doc.text('No student data available at the moment.', doc.page.width / 2, 570, { align: 'center' });
    } else {
      // Create beautiful table
      const tableX = 40;
      const tableY = 520;
      const tableWidth = doc.page.width - 80;
      const rowHeight = 35;
      const headerHeight = 40;

      // Table headers
      const headers = [
        { text: 'Rank', width: 40 },
        { text: 'Student Name', width: 120 },
        { text: 'University', width: 100 },
        { text: 'Program', width: 100 },
        { text: 'GPA', width: 50 },
        { text: 'Status', width: 70 },
        { text: 'Projects', width: 60 },
        { text: 'Revenue', width: 80 }
      ];

      // Draw header background
      drawRoundedRect(tableX, tableY, tableWidth, headerHeight, 8, '#4A5568');

      // Add header text
      let currentX = tableX + 10;
      doc.fontSize(11);
      doc.font('Helvetica-Bold');
      doc.fillColor('white');
      headers.forEach(header => {
        doc.text(header.text, currentX, tableY + 12);
        currentX += header.width;
      });

      // Add student rows
      students.forEach((student, index) => {
        const rowY = tableY + headerHeight + (index * rowHeight);
        
        // Check if we need a new page
        if (rowY + rowHeight > doc.page.height - 100) {
          doc.addPage();
          
          // Redraw header on new page
          drawRoundedRect(40, 40, tableWidth, headerHeight, 8, '#4A5568');
          currentX = 50;
          doc.fontSize(11);
          doc.font('Helvetica-Bold');
          doc.fillColor('white');
          headers.forEach(header => {
            doc.text(header.text, currentX, 52);
            currentX += header.width;
          });
          
          // Reset row Y position
          const newRowY = 80;
          drawStudentRow(student, index, newRowY, headers, tableX);
        } else {
          drawStudentRow(student, index, rowY, headers, tableX);
        }
      });
    }

    // Helper function to draw student row
    function drawStudentRow(student, index, rowY, headers, tableX) {
      // Alternate row colors
      const rowColor = index % 2 === 0 ? '#FFFFFF' : '#F7FAFC';
      drawRoundedRect(tableX, rowY, doc.page.width - 80, 35, 0, rowColor);

      // Add border
      doc.save();
      doc.strokeColor('#E2E8F0');
      doc.lineWidth(0.5);
      doc.moveTo(tableX, rowY);
      doc.lineTo(tableX + doc.page.width - 80, rowY);
      doc.stroke();
      doc.restore();

             // Add rank with special formatting for top 3
       let rankText = `${index + 1}`;
       if (index === 0) rankText = '1st';
       else if (index === 1) rankText = '2nd';
       else if (index === 2) rankText = '3rd';

      let currentX = tableX + 10;
      doc.fontSize(10);
      doc.font('Helvetica-Bold');
      doc.fillColor('#2D3748');
      doc.text(rankText, currentX, rowY + 10);
      currentX += headers[0].width;

      // Student name
      const studentName = `${student.firstName} ${student.lastName}`;
      doc.text(studentName.length > 15 ? studentName.substring(0, 12) + '...' : studentName, currentX, rowY + 10);
      currentX += headers[1].width;

      // University
      const university = student.university || 'Not specified';
      doc.text(university.length > 12 ? university.substring(0, 9) + '...' : university, currentX, rowY + 10);
      currentX += headers[2].width;

      // Program
      const program = student.degreeProgram || 'Not specified';
      doc.text(program.length > 12 ? program.substring(0, 9) + '...' : program, currentX, rowY + 10);
      currentX += headers[3].width;

      // GPA
      const gpa = student.gpa || 'N/A';
      doc.text(gpa, currentX, rowY + 10);
      currentX += headers[4].width;

      // Status with colored badge
      const status = student.isVerified ? 'Verified' : 'Pending';
      const statusColor = student.isVerified ? '#48BB78' : '#ED8936';
      doc.save();
      doc.fillColor(statusColor);
      doc.roundedRect(currentX, rowY + 5, 60, 20, 10);
      doc.fill();
      doc.fillColor('white');
      doc.fontSize(8);
      doc.font('Helvetica-Bold');
      doc.text(status, currentX + 5, rowY + 10);
      doc.restore();
      currentX += headers[5].width;

      // Projects
      doc.fillColor('#2D3748');
      doc.text(student.projects.toString(), currentX, rowY + 10);
      currentX += headers[6].width;

      // Revenue with currency formatting
      const revenue = `$${student.revenue.toLocaleString()}`;
      doc.font('Helvetica-Bold');
      doc.fillColor('#38A169');
      doc.text(revenue, currentX, rowY + 10);
    }

    // Add footer with gradient
    const footerY = doc.page.height - 60;
    const footerGradient = doc.linearGradient(0, footerY, 0, footerY + 60);
    footerGradient.stop(0, '#667eea');
    footerGradient.stop(1, '#764ba2');
    doc.fillColor(footerGradient);
    doc.rect(0, footerY, doc.page.width, 60);
    doc.fill();

    // Add footer text
    doc.fontSize(12);
    doc.font('Helvetica');
    doc.fillColor('white');
    doc.text('This report was generated automatically by the FlexiHire platform.', doc.page.width / 2, footerY + 20, { align: 'center' });
    doc.fontSize(10);
    doc.text('Empowering university students to succeed in the freelance economy', doc.page.width / 2, footerY + 40, { align: 'center' });

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate PDF report',
      error: error.message
    });
  }
};
