import User from '../models/User.js';
import Post from '../models/Post.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Order from '../models/Order.js';

// Get university performance analytics
export const getUniversityAnalytics = async (req, res) => {
  try {
    const { dateRange = 30, university, faculty, category } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

    // Build match conditions for filters
    const userMatchConditions = {
      userType: 'freelancer',
      university: { $exists: true, $ne: null, $ne: '' },
      createdAt: { $gte: daysAgo }
    };

    const postMatchConditions = {
      createdAt: { $gte: daysAgo }
    };

    // Apply university filter
    if (university && university !== '') {
      userMatchConditions.university = university;
    }

    // Apply faculty filter
    if (faculty && faculty !== '') {
      userMatchConditions.degreeProgram = faculty;
    }

    // Apply category filter (this will be applied to posts)
    if (category && category !== '') {
      postMatchConditions.category = category;
    }

    // Aggregate users by university (only freelancers have university field)
    const universityStats = await User.aggregate([
      {
        $match: userMatchConditions
      },
      {
        $group: {
          _id: '$university',
          users: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          name: '$_id',
          users: 1,
          activeUsers: 1,
          _id: 0
        }
      },
      {
        $sort: { users: -1 }
      }
    ]);

    // Get projects count by university (through freelancers)
    const universityProjects = await Post.aggregate([
      {
        $match: postMatchConditions
      },
      {
        $lookup: {
          from: 'users',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: '$client'
      },
      {
        $match: {
          'client.userType': 'client',
          'client.organization': { $exists: true, $ne: null, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$client.organization',
          projects: { $sum: 1 },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);

    // Combine university stats with project data
    const combinedStats = universityStats.map(uni => {
      const projectData = universityProjects.find(p => p._id === uni.name) || { projects: 0, totalBudget: 0 };
      return {
        name: uni.name,
        users: uni.users,
        projects: projectData.projects,
        revenue: projectData.totalBudget,
        growth: Math.floor(Math.random() * 20) + 5 // Mock growth for now
      };
    });

    res.json({
      success: true,
      data: combinedStats
    });
  } catch (error) {
    console.error('Error fetching university analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch university analytics',
      error: error.message
    });
  }
};

// Get faculty performance analytics
export const getFacultyAnalytics = async (req, res) => {
  try {
    const { dateRange = 30, university, faculty, category } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

    // Build match conditions for filters
    const userMatchConditions = {
      userType: 'freelancer',
      degreeProgram: { $exists: true, $ne: null, $ne: '' },
      createdAt: { $gte: daysAgo }
    };

    const postMatchConditions = {
      createdAt: { $gte: daysAgo }
    };

    // Apply university filter
    if (university && university !== '') {
      userMatchConditions.university = university;
    }

    // Apply faculty filter
    if (faculty && faculty !== '') {
      userMatchConditions.degreeProgram = faculty;
    }

    // Apply category filter
    if (category && category !== '') {
      postMatchConditions.category = category;
    }

    // Aggregate users by degree program (faculty equivalent)
    const facultyStats = await User.aggregate([
      {
        $match: userMatchConditions
      },
      {
        $group: {
          _id: '$degreeProgram',
          users: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          name: '$_id',
          users: 1,
          activeUsers: 1,
          _id: 0
        }
      },
      {
        $sort: { users: -1 }
      }
    ]);

    // Get projects count by category (as proxy for faculty)
    const categoryProjects = await Post.aggregate([
      {
        $match: postMatchConditions
      },
      {
        $group: {
          _id: '$category',
          projects: { $sum: 1 },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);

    // Combine faculty stats with project data
    const combinedStats = facultyStats.map(faculty => {
      const projectData = categoryProjects.find(p => p._id === faculty.name) || { projects: 0, totalBudget: 0 };
      return {
        name: faculty.name,
        users: faculty.users,
        projects: projectData.projects,
        revenue: projectData.totalBudget,
        growth: Math.floor(Math.random() * 20) + 5 // Mock growth for now
      };
    });

    res.json({
      success: true,
      data: combinedStats
    });
  } catch (error) {
    console.error('Error fetching faculty analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty analytics',
      error: error.message
    });
  }
};

// Get category performance analytics
export const getCategoryAnalytics = async (req, res) => {
  try {
    const { dateRange = 30, university, faculty, category } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

    // Build match conditions for filters
    const postMatchConditions = {
      createdAt: { $gte: daysAgo }
    };

    const serviceMatchConditions = {
      createdAt: { $gte: daysAgo }
    };

    // Apply category filter
    if (category && category !== '') {
      postMatchConditions.category = category;
      serviceMatchConditions.category = category;
    }

    // Apply university filter (through client organization)
    if (university && university !== '') {
      postMatchConditions['client.organization'] = university;
    }

    // Apply faculty filter (through freelancer degree program)
    if (faculty && faculty !== '') {
      serviceMatchConditions['freelancer.degreeProgram'] = faculty;
    }

    // Aggregate posts by category
    const postStats = await Post.aggregate([
      {
        $match: postMatchConditions
      },
      {
        $lookup: {
          from: 'users',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      {
        $unwind: '$client'
      },
      {
        $group: {
          _id: '$category',
          projects: { $sum: 1 },
          totalBudget: { $sum: '$budget' },
          avgBudget: { $avg: '$budget' },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          totalProjects: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          projects: 1,
          revenue: '$totalBudget',
          avgBudget: { $round: ['$avgBudget', 2] },
          successRate: {
            $round: [
              { $multiply: [{ $divide: ['$completedProjects', '$totalProjects'] }, 100] },
              1
            ]
          },
          _id: 0
        }
      },
      {
        $sort: { projects: -1 }
      }
    ]);

    // Aggregate services by category
    const serviceStats = await Service.aggregate([
      {
        $match: serviceMatchConditions
      },
      {
        $lookup: {
          from: 'users',
          localField: 'freelancerId',
          foreignField: '_id',
          as: 'freelancer'
        }
      },
      {
        $unwind: '$freelancer'
      },
      {
        $group: {
          _id: '$category',
          services: { $sum: 1 },
          totalRevenue: { $sum: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    // Combine post and service data by category
    const categoryMap = new Map();

    // Add post data
    postStats.forEach(cat => {
      categoryMap.set(cat.name, {
        name: cat.name,
        projects: cat.projects,
        revenue: cat.revenue,
        successRate: cat.successRate,
        avgBudget: cat.avgBudget
      });
    });

    // Add service data to existing categories or create new ones
    serviceStats.forEach(service => {
      if (categoryMap.has(service._id)) {
        const existing = categoryMap.get(service._id);
        existing.revenue += service.totalRevenue;
        existing.avgBudget = (existing.avgBudget + service.avgPrice) / 2;
      } else {
        categoryMap.set(service._id, {
          name: service._id,
          projects: 0,
          revenue: service.totalRevenue,
          successRate: 0,
          avgBudget: service.avgPrice
        });
      }
    });

    const combinedStats = Array.from(categoryMap.values());

    res.json({
      success: true,
      data: combinedStats
    });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category analytics',
      error: error.message
    });
  }
};

// Get overall analytics summary
export const getAnalyticsSummary = async (req, res) => {
  try {
    const { dateRange = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

    // Get user counts
    const userStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          freelancers: {
            $sum: { $cond: [{ $eq: ['$userType', 'freelancer'] }, 1, 0] }
          },
          clients: {
            $sum: { $cond: [{ $eq: ['$userType', 'client'] }, 1, 0] }
          },
          universityStaff: {
            $sum: { $cond: [{ $eq: ['$userType', 'university_staff'] }, 1, 0] }
          },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          suspended: {
            $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get project counts
    const projectStats = await Project.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalBudget: { $sum: '$budget' },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get service counts
    const serviceStats = await Service.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalRevenue: { $sum: '$price' },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]);

    const summary = {
      users: userStats[0] || { total: 0, freelancers: 0, clients: 0, universityStaff: 0, active: 0, suspended: 0 },
      projects: projectStats[0] || { total: 0, totalBudget: 0, active: 0, completed: 0 },
      services: serviceStats[0] || { total: 0, totalRevenue: 0, active: 0 }
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary',
      error: error.message
    });
  }
};

// Freelancer personal overview metrics
export const getFreelancerOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    // Orders where user is freelancer
    const orders = await Order.find({ freelancerId: userId });
    const completedOrders = orders.filter(o => o.status === 'Completed');
    const activeOrders = orders.filter(o => ['In Progress','Review','Revision','Payment Confirmed'].includes(o.status));
    const totalEarnings = orders.reduce((sum, o) => {
      // prefer paymentDetails.freelancerAmount if present else proportional from totalAmount (assume 80%)
      if (o.paymentDetails && typeof o.paymentDetails.freelancerAmount === 'number') {
        return sum + o.paymentDetails.freelancerAmount;
      }
      return sum + (o.totalAmount ? o.totalAmount * 0.8 : 0);
    }, 0);

    // Services for rating metrics
    const services = await Service.find({ freelancerId: userId });
    let ratingAvg = 0; let ratingCount = 0;
    if (services.length) {
      let sumWeighted = 0; let totalReviews = 0;
      services.forEach(s => {
        if (s.reviews && s.reviews.length) {
          const serviceReviews = s.reviews.length;
            totalReviews += serviceReviews;
            if (typeof s.rating === 'number') {
              sumWeighted += s.rating * serviceReviews;
            }
        }
      });
      ratingCount = totalReviews;
      ratingAvg = totalReviews ? (sumWeighted / totalReviews) : 0;
    }

    res.json({
      success: true,
      data: {
        completedProjects: completedOrders.length,
        activeProjects: activeOrders.length,
        totalEarnings: Number(totalEarnings.toFixed(2)),
        ratingAverage: Number(ratingAvg.toFixed(2)),
        totalReviews: ratingCount
      }
    });
  } catch (error) {
    console.error('Freelancer overview error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch freelancer overview', error: error.message });
  }
};
