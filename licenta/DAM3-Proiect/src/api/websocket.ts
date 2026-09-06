export class ExpenseWsClient { static connect(groupId: string) { return new WebSocket(`ws://localhost:8080/ws/expenses/${groupId}`); } }
