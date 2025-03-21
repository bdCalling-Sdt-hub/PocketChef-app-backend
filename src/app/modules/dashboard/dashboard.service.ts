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


const totalNewUserFromDB = async () => {
    const result = await User.aggregate([
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                month: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$_id.month", 1] }, then: "January" },
                            { case: { $eq: ["$_id.month", 2] }, then: "February" },
                            { case: { $eq: ["$_id.month", 3] }, then: "March" },
                            { case: { $eq: ["$_id.month", 4] }, then: "April" },
                            { case: { $eq: ["$_id.month", 5] }, then: "May" },
                            { case: { $eq: ["$_id.month", 6] }, then: "June" },
                            { case: { $eq: ["$_id.month", 7] }, then: "July" },
                            { case: { $eq: ["$_id.month", 8] }, then: "August" },
                            { case: { $eq: ["$_id.month", 9] }, then: "September" },
                            { case: { $eq: ["$_id.month", 10] }, then: "October" },
                            { case: { $eq: ["$_id.month", 11] }, then: "November" },
                            { case: { $eq: ["$_id.month", 12] }, then: "December" }
                        ]
                    }
                },
                year: "$_id.year",
                count: 1
            }
        },
        {
            $sort: { year: -1, "_id.month": -1 }
        }
    ]);

    if (!result || result.length === 0) {
        return [];
    }

    // Create array of all months
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Create complete dataset with 0 counts for missing months
    const completeData = months.map(month => {
        // @ts-ignore
        const found = result.find(r => r.month === month && r.year === currentYear);
        return {
            month,
            // @ts-ignore
            year: currentYear,
            count: found ? found.count : 0
        };
    });

    return completeData;
}

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
    RecentViewRecipeFromDB
};
