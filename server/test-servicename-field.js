import Service from './models/Service.js';
import CleaningService from './models/CleaningService.js';
import GreenService from './models/GreenService.js';
import VehicleAccessory from './models/VehicleAccessory.js';
import VehicleCheckupBooking from './models/VehicleCheckupBooking.js';
import KeyServiceBooking from './models/KeyServiceBooking.js';
import MoversPackers from './models/MoversPackers.js';
import PaintingQuote from './models/PaintingQuote.js';
import GreenBooking from './models/GreenBooking.js';
import Booking from './models/Booking.js';

console.log('✅ All models imported successfully\n');
console.log('Field verification (serviceName field added in this PR):');
console.log('Service schema includes serviceName:', Service.schema.paths.serviceName ? '✓' : '✗');
console.log('CleaningService schema includes serviceName:', CleaningService.schema.paths.serviceName ? '✓' : '✗');
console.log('GreenService schema includes serviceName:', GreenService.schema.paths.serviceName ? '✓' : '✗');
console.log('VehicleAccessory schema includes serviceName:', VehicleAccessory.schema.paths.serviceName ? '✓' : '✗');
console.log('VehicleCheckupBooking schema includes serviceName:', VehicleCheckupBooking.schema.paths.serviceName ? '✓' : '✗');
console.log('KeyServiceBooking schema includes serviceName:', KeyServiceBooking.schema.paths.serviceName ? '✓' : '✗');
console.log('MoversPackers schema includes serviceName:', MoversPackers.schema.paths.serviceName ? '✓' : '✗');
console.log('PaintingQuote schema includes serviceName:', PaintingQuote.schema.paths.serviceName ? '✓' : '✗');
console.log('\nPre-existing fields (already had serviceName):');
console.log('GreenBooking schema includes serviceName:', GreenBooking.schema.paths.serviceName ? '✓ (pre-existing)' : '✗');

process.exit(0);
