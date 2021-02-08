import { Ticket } from '../ticket';

it('implements version control (optimistic concurrency control)', async ()=> {
    const tick = Ticket.build({ title: 'test title', price:10, userId: '12345' });
    await tick.save();
    const fstInstance = await Ticket.findById(tick.id);
    console.log('after create' , fstInstance.version);
/*    const scndInstance = await Ticket.findById(tick.id);
    fstInstance.set({price: 20});
    scndInstance.set({ price: 30});
    await fstInstance.save();
    await scndInstance.save();
*/
    fstInstance.set({price: 20});
    await fstInstance.save();
    console.log('after update', fstInstance.version);

    fstInstance.set({price: 30});
    await fstInstance.save();
    console.log('after second update', fstInstance.version);
});