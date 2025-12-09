const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // ✅ Create or update the event
  const event = await prisma.event.upsert({
    where: { slug: 'grand-music-night-2025' },
    update: {},
    create: {
      title: 'Grand Music Night 2025',
      slug: 'grand-music-night-2025',
    },
  })

  // ✅ Define all tables with coordinates, seats, and prices
  const desktopTables = {
  
// DO
  1: { seats: 10, top: '48.9%', left: '50.9%', price: 18.800, color: '#f07f1d' },
101: { seats: 10, top: '46.9%', left: '55.9%', price: 18.800, color: '#f07f1d' },
104: { seats: 10, top: '48.9%', left: '60.9%', price:  18.800, color: '#f07f1d' },
105: { seats: 10, top: '42.9%', left: '59.9%', price: 18800, color: '#f07f1d' },
106: { seats: 10, top: '37.9%', left: '58.9%', price: 18800, color: '#f07f1d' },
201: { seats: 10, top: '47.9%', left: '45.9%', price: 18800, color: '#f07f1d' },
204: { seats: 10, top: '47.9%', left: '38.9%', price:  18800, color: '#f07f1d' },
205: { seats: 10, top: '42.9%', left: '40.9%', price: 18800, color: '#f07f1d' },
206: { seats: 10, top: '37.9%', left: '42.9%', price: 18800, color: '#f07f1d' },
209: { seats: 10, top: '37.9%', left: '37.9%', price:  18800, color: '#f07f1d' },
401: { seats: 12, top: '58.9%', left: '43.9%', price:  18800, color: '#f07f1d' },
402: { seats: 8, top: '58.9%', left: '57.9%', price:  18800, color: '#f07f1d' },
422: { seats: 6, top: '58.9%', left: '51.9%', price:  18800, color: '#f07f1d' },

// RE
102: { seats: 10, top: '33.9%', left: '54.9%', price: 16800, color: '#2e6cb3' },
107: { seats: 10, top: '31.9%', left: '59.9%', price:  16800, color: '#2e6cb3' },
202: { seats: 10, top: '32.9%', left: '44.9%', price: 16800, color: '#2e6cb3' },
207: { seats: 10, top: '31.9%', left: '38.9%', price:  16800, color: '#2e6cb3' },
210: { seats: 12, top: '36.2%', left: '31.9%', price:  16800, color: '#2e6cb3' },
301: { seats: 6, top: '57.5%', left: '34.7%', price: 16800, color: '#2e6cb3' },
302: { seats: 8, top: '53.8%', left: '29.4%', price: 16800, color: '#2e6cb3' },
701: { seats: 10, top: '51.6%', left: '66.8%', price:  16800, color: '#2e6cb3' },
702: { seats: 10, top: '45.9%', left: '66.2%', price:  16800, color: '#2e6cb3' },
703: { seats: 10, top: '36.2%', left: '66.2%', price:  16800, color: '#2e6cb3' },
705: { seats: 10, top: '49.6%', left: '71.3%', price:  16800, color: '#2e6cb3' },
706: { seats: 10, top: '43.9%', left: '70.9%', price:  16800, color: '#2e6cb3' },

// MI
211: { seats: 12, top: '29.6%', left: '31.9%', price:  14800, color: '#63b32e' },
303: { seats: 6, top: '61.8%', left: '31.4%', price: 14800, color: '#63b32e' },
304: { seats: 6, top: '57.8%', left: '26.4%', price: 14800, color: '#63b32e' },
306: { seats: 8, top: '64.5%', left: '23.7%', price: 14800, color: '#63b32e' },
305: { seats: 8, top: '66.8%', left: '28.4%', price: 14800, color: '#63b32e' },
403: { seats: 8, top: '63.5%', left: '47%', price:  14800, color: '#63b32e' },
404: { seats: 8, top: '63.7%', left: '55%', price:  14800, color: '#63b32e' },
704: { seats: 10, top: '30.9%', left: '66.2%', price:  14800, color: '#63b32e' },
801: { seats: 6, top: '44.8%', left: '75.4%', price: 14800, color: '#63b32e' },
802: { seats: 6, top: '36.8%', left: '75.4%', price: 14800, color: '#63b32e' },
803: { seats: 8, top: '42.9%', left: '79.3%', price: 14800, color: '#63b32e' },
804: { seats: 8, top: '36.9%', left: '79.3%', price: 14800, color: '#63b32e' },
805: { seats: 6, top: '44.5%', left: '84.7%', price: 14800, color: '#63b32e' },
806: { seats: 6, top: '38.8%', left: '84.4%', price: 14800, color: '#63b32e' },
807: { seats: 8, top: '33.8%', left: '83.4%', price: 14800, color: '#63b32e' },

// FAMILY
601: { seats: 12, top: '69.5%', left: '72.7%', price: 10800, color: '#e62320' },
602: { seats:12, top: '63.8%', left: '72.7%', price: 10800, color: '#e62320' },
405: { seats: 10, top: '67.8%', left: '64.4%', price:  10800, color: '#e62320' },
501: { seats: 12, top: '71.5%', left: '57.7%', price:  10800, color: '#e62320' },
502: { seats: 12, top: '71.5%', left: '51.4%', price:  10800, color: '#e62320' },
503: { seats: 12, top: '71.5%', left: '43.7%', price:  10800, color: '#e62320' },


  }

  // ✅ Create or update tables and their seats
  for (const [numStr, t] of Object.entries(desktopTables)) {
    const table = await prisma.table.upsert({
      where: { eventId_number: { eventId: event.id, number: parseInt(numStr) } },
      update: {},
      create: {
        eventId: event.id,
        number: parseInt(numStr),
        top: t.top,
        left: t.left,
        price: t.price,
        color: t.color,
      },
    })

    const seats = []
    for (let i = 1; i <= t.seats; i++) {
      seats.push({
        tableId: table.id,
        seatNo: i,
        label: `T${numStr}-${i}`,
        status: 'AVAILABLE',
      })
    }
    await prisma.seat.createMany({ data: seats, skipDuplicates: true })
  }

  // ✅ Create admin user for login
   await prisma.admin.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      password: 'supersecure123', // change after first login
      role: 'OWNER',
    },
  })

  // Create Child Admin
  await prisma.admin.upsert({
    where: { username: 'childadmin' },
    update: {},
    create: {
      username: 'childadmin',
      password: 'childpass123',
      role: 'MANAGER',
    },
  })

  console.log('✅ Seed complete — event, tables, seats, and admin created!')
}

// Run the script
main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
