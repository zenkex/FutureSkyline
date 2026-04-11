export interface Post {
    title: string;
    date: string;
    slug: string;
}

export async function getAllPosts(): Promise<Post[]> {
    return [
        {
            title: '如何利用供需区识别高概率反转交易机会',
            date: '2026-04-10',
            slug: 'supply-demand-reversal',
        },
        {
            title: 'EMA 交叉策略：捕捉趋势启动与回调入场点',
            date: '2026-04-08',
            slug: 'ema-crossover-strategy',
        },
        {
            title: '订单流分析：解读市场深度与主力资金动向',
            date: '2026-04-05',
            slug: 'order-flow-analysis',
        },
        {
            title: '波动率突破策略：基于ATR的动态止盈止损设置',
            date: '2026-04-02',
            slug: 'volatility-breakout-atr',
        },
        {
            title: '多时间框架分析：从周线趋势到15分钟入场',
            date: '2026-03-28',
            slug: 'multi-timeframe-analysis',
        },
    ];
}