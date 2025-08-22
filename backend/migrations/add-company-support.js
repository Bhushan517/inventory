const { sequelize } = require('../config/database');
const { Company, User, Product } = require('../models');

async function migrateToCompanySupport() {
  console.log('🔄 Starting migration to add company support...');
  
  try {
    // Force sync all models (this will add new columns)
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema updated');

    // Check if there's a default company
    let defaultCompany = await Company.findOne({ where: { name: 'Default Company' } });
    
    if (!defaultCompany) {
      // Create default company
      defaultCompany = await Company.create({
        name: 'Default Company',
        email: 'admin@defaultcompany.com',
        status: 'active'
      });
      console.log('✅ Default company created');
    }

    // Update existing users without company_id
    const usersWithoutCompany = await User.findAll({
      where: { company_id: null }
    });

    if (usersWithoutCompany.length > 0) {
      await User.update(
        { company_id: defaultCompany.id },
        { where: { company_id: null } }
      );
      console.log(`✅ Updated ${usersWithoutCompany.length} users with default company`);
    }

    // Update existing products without company_id
    const productsWithoutCompany = await Product.findAll({
      where: { company_id: null }
    });

    if (productsWithoutCompany.length > 0) {
      await Product.update(
        { company_id: defaultCompany.id },
        { where: { company_id: null } }
      );
      console.log(`✅ Updated ${productsWithoutCompany.length} products with default company`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log('📝 You can now register new companies at /api/auth/register');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateToCompanySupport()
    .then(() => {
      console.log('Migration completed. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateToCompanySupport };
