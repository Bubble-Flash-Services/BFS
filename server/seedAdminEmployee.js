import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Employee from './models/Employee.js';

dotenv.config();

const seedAdminEmployeeData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bubbleflash');
    console.log('Connected to MongoDB');

    // Clear existing admin and employee data
    await Admin.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing admin and employee data');

    // Create Super Admin
    const superAdmin = new Admin({
      name: 'Super Admin',
      email: 'admin@bubbleflash.com',
      password: 'admin123', // This will be hashed automatically
      role: 'superadmin',
      permissions: ['users', 'bookings', 'employees', 'services', 'coupons', 'analytics', 'system'],
      phone: '9999999999'
    });

    await superAdmin.save();
    console.log('✅ Super Admin created:', superAdmin.email);

    // Create Regular Admin
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin2@bubbleflash.com',
      password: 'admin123',
      role: 'admin',
      permissions: ['users', 'bookings', 'employees', 'services', 'coupons'],
      phone: '9999999998',
      createdBy: superAdmin._id
    });

    await admin.save();
    console.log('✅ Regular Admin created:', admin.email);

    // Create Sample Employees
    const employees = [
      {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@bubbleflash.com',
        phone: '9876543210',
        password: 'employee123',
        address: '123 Main Street, HSR Layout, Bangalore',
        specialization: 'car',
        salary: 25000,
        commissionRate: 15,
        emergencyContact: {
          name: 'Sunita Kumar',
          phone: '9876543211',
          relation: 'Wife'
        },
        bankDetails: {
          accountNumber: '1234567890',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank',
          accountHolder: 'Ravi Kumar'
        },
        documents: {
          aadharVerified: true,
          panVerified: true,
          licenseVerified: true,
          aadharNumber: '1234-5678-9012',
          panNumber: 'ABCDE1234F',
          licenseNumber: 'DL1420110012345'
        },
        stats: {
          totalAssignments: 145,
          completedTasks: 138,
          averageRating: 4.8,
          totalEarnings: 45600,
          onTimeCompletion: 95.5,
          customerSatisfaction: 98.2
        },
        createdBy: superAdmin._id
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@bubbleflash.com',
        phone: '9876543220',
        password: 'employee123',
        address: '456 Park Avenue, Koramangala, Bangalore',
        specialization: 'bike',
        salary: 22000,
        commissionRate: 12,
        emergencyContact: {
          name: 'Raj Sharma',
          phone: '9876543221',
          relation: 'Husband'
        },
        bankDetails: {
          accountNumber: '0987654321',
          ifscCode: 'ICICI0001234',
          bankName: 'ICICI Bank',
          accountHolder: 'Priya Sharma'
        },
        documents: {
          aadharVerified: true,
          panVerified: true,
          licenseVerified: true,
          aadharNumber: '2345-6789-0123',
          panNumber: 'BCDEF2345G',
          licenseNumber: 'DL1420110054321'
        },
        stats: {
          totalAssignments: 98,
          completedTasks: 92,
          averageRating: 4.6,
          totalEarnings: 28400,
          onTimeCompletion: 94.0,
          customerSatisfaction: 96.5
        },
        createdBy: superAdmin._id
      },
      {
        name: 'Suresh Reddy',
        email: 'suresh.reddy@bubbleflash.com',
        phone: '9876543230',
        password: 'employee123',
        address: '789 Tech Park, Whitefield, Bangalore',
        specialization: 'laundry',
        salary: 27000,
        commissionRate: 18,
        emergencyContact: {
          name: 'Lakshmi Reddy',
          phone: '9876543231',
          relation: 'Wife'
        },
        bankDetails: {
          accountNumber: '1122334455',
          ifscCode: 'SBI0001234',
          bankName: 'State Bank of India',
          accountHolder: 'Suresh Reddy'
        },
        documents: {
          aadharVerified: true,
          panVerified: false,
          licenseVerified: true,
          aadharNumber: '3456-7890-1234',
          panNumber: 'CDEFG3456H',
          licenseNumber: 'DL1420110067890'
        },
        stats: {
          totalAssignments: 76,
          completedTasks: 71,
          averageRating: 4.4,
          totalEarnings: 32100,
          onTimeCompletion: 93.5,
          customerSatisfaction: 95.8
        },
        createdBy: superAdmin._id
      },
      {
        name: 'Kavya Rao',
        email: 'kavya.rao@bubbleflash.com',
        phone: '9876543240',
        password: 'employee123',
        address: '321 Ring Road, BTM Layout, Bangalore',
        specialization: 'car',
        salary: 24000,
        commissionRate: 14,
        emergencyContact: {
          name: 'Mohan Rao',
          phone: '9876543241',
          relation: 'Father'
        },
        bankDetails: {
          accountNumber: '5566778899',
          ifscCode: 'AXIS0001234',
          bankName: 'Axis Bank',
          accountHolder: 'Kavya Rao'
        },
        documents: {
          aadharVerified: true,
          panVerified: true,
          licenseVerified: false,
          aadharNumber: '4567-8901-2345',
          panNumber: 'DEFGH4567I',
          licenseNumber: ''
        },
        stats: {
          totalAssignments: 52,
          completedTasks: 48,
          averageRating: 4.7,
          totalEarnings: 18200,
          onTimeCompletion: 92.3,
          customerSatisfaction: 97.1
        },
        createdBy: superAdmin._id
      },
      {
        name: 'Arjun Krishnan',
        email: 'arjun.krishnan@bubbleflash.com',
        phone: '9876543250',
        password: 'employee123',
        address: '555 100 Feet Road, Indiranagar, Bangalore',
        specialization: 'all',
        salary: 30000,
        commissionRate: 20,
        emergencyContact: {
          name: 'Meera Krishnan',
          phone: '9876543251',
          relation: 'Sister'
        },
        bankDetails: {
          accountNumber: '9988776655',
          ifscCode: 'HDFC0005678',
          bankName: 'HDFC Bank',
          accountHolder: 'Arjun Krishnan'
        },
        documents: {
          aadharVerified: true,
          panVerified: true,
          licenseVerified: true,
          aadharNumber: '5678-9012-3456',
          panNumber: 'EFGHI5678J',
          licenseNumber: 'DL1420110078901'
        },
        stats: {
          totalAssignments: 123,
          completedTasks: 119,
          averageRating: 4.9,
          totalEarnings: 52300,
          onTimeCompletion: 96.8,
          customerSatisfaction: 99.1
        },
        createdBy: superAdmin._id
      }
    ];

    const createdEmployees = [];
    for (const empData of employees) {
      const employee = new Employee(empData);
      const savedEmployee = await employee.save();
      createdEmployees.push(savedEmployee);
    }
    console.log(`✅ Created ${createdEmployees.length} employees`);

    // Display login credentials
    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('\n--- ADMIN ACCOUNTS ---');
    console.log('Super Admin:');
    console.log('  Email: admin@bubbleflash.com');
    console.log('  Password: admin123');
    console.log('  URL: http://localhost:3000/admin');
    
    console.log('\nRegular Admin:');
    console.log('  Email: admin2@bubbleflash.com');
    console.log('  Password: admin123');
    console.log('  URL: http://localhost:3000/admin');

    console.log('\n--- EMPLOYEE ACCOUNTS ---');
    createdEmployees.forEach(emp => {
      console.log(`${emp.name} (${emp.specialization}):`);
      console.log(`  Email: ${emp.email}`);
      console.log(`  Password: employee123`);
      console.log(`  Employee ID: ${emp.employeeId}`);
      console.log(`  URL: http://localhost:3000/employee`);
    });

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Start your backend: npm run dev');
    console.log('2. Start your frontend: npm run dev');
    console.log('3. Visit admin panel: http://localhost:3000/admin');
    console.log('4. Visit employee portal: http://localhost:3000/employee');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the seed function
seedAdminEmployeeData();
