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
    const result = await rating.find({
        rating: { $gte: 4 }
    })
        .sort({ takeCount: -1 })  // Sort by 'takeCount' in descending order to show most taken recipes
        .limit(4);  // Limit to the top 4 recipes

    if (!result || result.length === 0) {
        return []
    }
    return result;
}


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
