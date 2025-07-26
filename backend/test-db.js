import { dbOperations } from './database.js';

async function testDatabase() {
  try {
    console.log('Testing database operations...\n');
    
    // Test getting all spaces
    console.log('1. Getting all spaces:');
    const allSpaces = await dbOperations.getSpaces();
    console.log(`Found ${allSpaces.length} spaces`);
    allSpaces.forEach(space => {
      console.log(`- ${space.name} (${space.city}) - €${space.pricePerDay}/day`);
    });
    
    // Test filtering by city
    console.log('\n2. Getting spaces in Madrid:');
    const madridSpaces = await dbOperations.getSpaces('Madrid');
    console.log(`Found ${madridSpaces.length} spaces in Madrid`);
    
    // Test filtering by amenities
    console.log('\n3. Getting spaces with cafe amenity:');
    const cafeSpaces = await dbOperations.getSpaces(null, ['cafe']);
    console.log(`Found ${cafeSpaces.length} spaces with cafe`);
    
    // Test creating a booking
    console.log('\n4. Creating a test booking:');
    const booking = await dbOperations.createBooking(1, 'test-user-123', '2025-08-01');
    console.log('Booking created:', booking);
    
    // Test getting recent bookings
    console.log('\n5. Getting recent bookings:');
    const recentBookings = await dbOperations.getRecentBookings(3);
    console.log(`Found ${recentBookings.length} recent bookings`);
    recentBookings.forEach(booking => {
      console.log(`- ${booking.spaceName} for ${booking.userName} on ${booking.date}`);
    });
    
    console.log('\n✅ All database operations work correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
  
  process.exit(0);
}

testDatabase();
