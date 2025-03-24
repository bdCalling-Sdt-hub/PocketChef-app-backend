import { rating } from '../rating/rating.model';
import { Recentfavorates } from '../recentfavorates/recentfavorates.model';
import { Recipe } from '../Recipes/Recipes.model';
import { User } from '../user/user.model';

const totalUserFromDB = async () => {
    const result = await User.find({});
    if (!result) {
        return []
    }
    return result;
}
const totalData = async () => {
    const users = await User.find({});
    const recipes = await Recipe.find({});

    // Get new users for current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newUsers = users.filter((user) => {
        // @ts-ignore
        const userCreatedAt = new Date(user.createdAt);
        return userCreatedAt >= firstDayOfMonth;
    });

    return {
        totalUsers: users.length,
        newUsersThisMonth: newUsers.length,
        totalRecipes: recipes.length
    };
}



const totalNewUserFromDB = async () => {
    const currentYear = new Date().getFullYear();

    const result = await User.aggregate([
        {
            $match: { createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) } }
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                month: {
                    $arrayElemAt: [
                        [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ],
                        { $subtract: ["$_id.month", 1] }
                    ]
                },
                count: 1
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
    ]);

    // Create complete dataset with 0 counts for missing months
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const completeData = months.map((month, index) => {
        const found = result.find(r => r.month === month);
        return {
            month,
            year: currentYear,
            count: found ? found.count : 0
        };
    });

    return completeData;
};



const totalRecipeFromDB = async () => {
    const result = await Recipe.find({});
    if (!result) {
        return []
    }
    return result;
}

const totalRecommendationRecipeFromDB = async () => {
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Query to find recipes with rating >= 4 for the current year
    const result = await rating.aggregate([
        {
            $match: {
                rating: { $gte: 4 },
                createdAt: {
                    $gte: new Date(`${currentYear}-01-01`), // Start of the current year
                    $lt: new Date(`${currentYear + 1}-01-01`), // Start of the next year
                },
            },
        },
        {
            $group: {
                _id: { $month: "$createdAt" }, // Group by month (1-12)
                totalRecommendations: { $sum: 1 }, // Count the total recommendations for each month
            },
        },
        {
            $sort: { _id: 1 }, // Sort by month (ascending order)
        },
    ]);

    // If no results are found, return an empty array
    if (!result || result.length === 0) {
        return [];
    }

    // Month names (this array corresponds to the months in the year)
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    // Process the result to ensure we have all months from Jan to Dec
    const monthlyData = new Array(12).fill(0); // Array to store the data for all months (0 for missing months)
    result.forEach((data) => {
        monthlyData[data._id - 1] = data.totalRecommendations; // Map the result to the correct month
    });

    // Return the processed data with month names included
    const monthDataWithNames = months.map((month, index) => {
        return {
            month: month,
            recommendations: monthlyData[index]
        };
    });

    return monthDataWithNames; // Return the data
};




const RecentViewRecipeFromDB = async () => {
    const result = await Recentfavorates.find({})
        .populate('recipeId')
        .sort({ takeCount: -1 })
        .limit(4);

    const totalCount = await rating.countDocuments({
        rating: { $gte: 4 }
    });  // This gives you the correct total count of recipes

    if (!result || result.length === 0) {
        return {
            success: false,
            message: "No recipes found",
            Total: 0,
            data: []
        };
    }

    return {
        result
    };
};



export const DashboardServices = {
    totalUserFromDB,
    totalNewUserFromDB,
    totalRecipeFromDB,
    totalRecommendationRecipeFromDB,
    RecentViewRecipeFromDB,
    totalData
};
