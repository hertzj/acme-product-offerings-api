const Sequelize = require('sequelize');
const {STRING, BOOLEAN, DECIMAL} = Sequelize;

const conn = new Sequelize('postgres://localhost:5432/product_offerings', {
    logging: false,
});


const Product = conn.define('Products', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    suggestedPrice: {
        type: DECIMAL,
        allowNull: false,
        unique: true,
    }
});

const Company = conn.define('Companies', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
    }
});

const Offering = conn.define('Offering', {
    price: {
        type: DECIMAL,
        allowNull: false,
        unique: true,
        defaultValue: 2.0
    }
});


const products = [
    {
        name: 'bar',
        suggestedPrice: 5
    },
    {
        name: 'bazz',
        suggestedPrice: 7
    },
    {
        name: 'foo',
        suggestedPrice: 9
    },
    {
        name: 'quq',
        suggestedPrice: 99
    }
];

const companies = [
    {
        name: 'Walmart'
    },
    {
        name: 'Target'
    },
    {
        name: 'Sears'
    }
];

const offerings = [
    {
        price: 4.5
    },
    {
        price: 5.5
    },
    {
        price: 7.8
    },
    {
        price: 7.5
    },
    {
        price: 9.1
    },
    {
        price: 8.9
    },
    {
        price: 100
    },
    {
        price: 150
    },
]

// one to many
// Company.hasMany(Offering);
// Offering.belongsTo(Company);

// Product.hasMany(Offering);
// Offering.belongsTo(Product);

Company.belongsToMany(Product, {through: 'Offering'});
Product.belongsToMany(Company, {through: 'Offering'});

const syncAndSeed = async (force = true) => {
    try {
        await conn.sync({force})

        const [bar, bazz, foo, quq] = await Promise.all(products.map(product => Product.create(product)));

        const [walmart, target, sears] = await Promise.all(companies.map(company => Company.create(company)));

        // const [off1, off2, off3, off4, off5, off6, off7, off8] = await Promise.all(offerings.map(offering => Offering.create(offering)));



    }

    catch (e) {
        console.log('we fucked up')
    }
}

module.exports = {
    syncAndSeed,
    Product,
    Company,
    Offering
}