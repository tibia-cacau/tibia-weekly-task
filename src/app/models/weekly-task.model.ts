export interface WeeklyTask {
	id: number;
	taskType: 'ITEM_DELIVERY' | 'MONSTER_KILL';
	name: string;
	itemName?: string;
	itemQuantity?: number;
	imageUrl?: string;
	monsterName?: string;
	killCount?: number;
	location: string;
	difficulty: number;
	estimatedTime: number;
	rewardType: string;
	rewardAmount: number;
	requirements: string[];
	notes?: string;
}

export interface SessionAnalyserRequest {
	monsterNames: string[];
	lootedItems?: string[];
}

export interface TaskItemInfo {
	itemName: string;
	imageUrl?: string;
	quantityNeeded?: number;
	taskId: number;
	taskName: string;
	price?: number;
}

export interface SessionAnalyserResponse {
	itemDeliveryTasks: WeeklyTask[];
	monsterKillTasks: WeeklyTask[];
	monsterKillCounts: { [key: string]: number };
	totalItemTasks: number;
	totalMonsterTasks: number;
	lootedTaskItems: TaskItemInfo[];
}

export interface KilledMonster {
	name: string;
	quantity: number;
}

export interface SessionData {
	sessionStart?: string;
	sessionEnd?: string;
	duration?: string;
	killedMonsters: KilledMonster[];
}
