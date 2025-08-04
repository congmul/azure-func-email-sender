import { app, InvocationContext, Timer } from "@azure/functions";

const coreServiceUrl = process.env.CORE_SERVICE_URL!;
const userServiceUrl = process.env.USER_SERVICE_URL!;

export async function checkPendingStatus(myTimer: Timer, context: InvocationContext): Promise<void> {
    try{
        const response = await fetch(`${coreServiceUrl}/transaction/pending?type=this_month`);
        const pendingGroupedByUser = await response.json();
        console.log(pendingGroupedByUser)
        
        if (pendingGroupedByUser.length > 0) {
            for (const group of pendingGroupedByUser) {
                context.log(`User ID: ${group._id}, Number of Pending Transactions: ${group.transactions.length}`);
                // Fetch user details from the user service
                context.log(`Fetching user details for User ID: ${group._id}`);
                const response = await fetch(`${userServiceUrl}/user/${group._id}?type=id`);
                const user = await response.json();
                if(!user){
                    context.log(`User with ID ${group._id} not found.`);
                }else{
                    context.log(`User Email: ${user.email}`);
                    // Here you can push messages to Service Bus for each user group
                    // For example, you can use Azure Service Bus SDK to send messages
                    // await serviceBusSender.sendMessages({
                    //     body: {
                    //         userId: group._id,
                    //         email: user.email,
                    //         transactions: group.transactions
                    //     }
                    // });
                }
            }
        } else {
        context.log("No pending transactions found.");
        }
    }catch (error) {
        context.log('Error in checkPendingStatus:', error);
        return;
    }
}

app.timer('checkPendingStatus', {
    schedule: '10 * * * * *',
    handler: checkPendingStatus
});
