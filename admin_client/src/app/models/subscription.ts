
export class SubscriptionLevel{
    level: number; // Integer
    price: number;// float
    name: string;
    desc: string;
}

export class Subscription{
    id: string;
    name: string;
    desc: string;
    defaultPrice: number;

    levels: SubscriptionLevel[];
}