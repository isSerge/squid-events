import {
    SubstrateBatchProcessor,
    BatchContext,
    BatchProcessorCallItem,
    BatchProcessorEventItem,
    BatchProcessorItem,
} from '@subsquid/substrate-processor';
import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import config from './config';

export type Item = BatchProcessorItem<typeof processor>
export type EventItem = BatchProcessorEventItem<typeof processor>
export type CallItem = BatchProcessorCallItem<typeof processor>
export type Context = BatchContext<Store, Item>

const processor = new SubstrateBatchProcessor()
    .setBatchSize(config.batchSize || 500)
    .setDataSource(config.dataSource)
    .setBlockRange(config.blockRange || { from: 0 })
    .addEvent('*') // process all events
    .includeAllBlocks();

processor.run(new TypeormDatabase(), processBalances);

async function processBalances(ctx: Context) {
    for (const block of ctx.blocks) {
        for (const item of block.items) {
            if (item.kind === 'event') {
                processEvent(item);
            }
        }
    }
}

function processEvent(item: EventItem) {
    switch (item.name) {
        case 'Balances.BalanceSet': {
            // do something with event
            break;
        }
    }
}
