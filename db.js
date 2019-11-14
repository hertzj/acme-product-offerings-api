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
        suggestedPrice: 9
    },
    {
        name: 'foo',
        suggestedPrice: 3
    },
    {
        name: 'quq',
        suggestedPrice: 3
    }
];

const companies = [
    {
        name: 'Acme US'
    },
    {
        name: 'Acme Global'
    },
    {
        name: 'Acme Tri-State'
    }
];

// const offerings = [
//     {
//         price: 2.9
//     },
//     {
//         price: 2.8
//     },
//     {
//         price: 4.5
//     },
//     {
//         price: 11
//     }
// ]

// one to many solution
Company.hasMany(Offering, {foreignKey: 'companyId'});
Offering.belongsTo(Company, {foreignKey: 'companyId'});

Product.hasMany(Offering, {foreignKey: 'productId'});
Offering.belongsTo(Product, {foreignKey: 'productId'});


// many to many solution - comment out offerings and [off1, off2, etc] below and uncomment offerings.Promise.all() on line 106,
// and uncomment the many to many relationships in the two lines below
// Company.belongsToMany(Product, {through: 'Offering', foreignKey: 'productId'});
// Product.belongsToMany(Company, {through: 'Offering', foreignKey: 'companyId'});

const syncAndSeed = async (force = true) => {
    try {
        await conn.sync({force})

        const [bar, bazz, foo, quq] = await Promise.all(products.map(product => Product.create(product)));

        const [acmeUS, acmeGlobal, acmeTriState] = await Promise.all(companies.map(company => Company.create(company)));

        // const offerings = await Promise.all([
        //     Offering.create({
        //         price: 2.9,
        //         companyId: acmeUS.id,
        //         productId: foo.id,

        //     }),
        //     Offering.create({
        //         price: 2.8,
        //         companyId: acmeGlobal.id,
        //         productId: foo.id,
        //     }),
        //     Offering.create({
        //         price: 4.5,
        //         companyId: acmeGlobal.id,
        //         productId: bar.id,
        //     }),
        //     Offering.create({
        //         price: 11,
        //         companyId: acmeTriState.id,
        //         productId: bazz.id,
        //     })
        // ])

        const offerings = [
            {
                price: 2.9, 
                companyId: acmeUS.id,
                productId: foo.id,
            },
            {
                price: 2.8,
                companyId: acmeGlobal.id,
                productId: foo.id,
            },
            {
                price: 4.5,
                companyId: acmeGlobal.id,
                productId: bar.id,
            },
            {
                price: 11,
                companyId: acmeTriState.id,
                productId: bazz.id,
            }
        ]

        const [off1, off2, off3, off4] = await Promise.all(offerings.map(offering => Offering.create(offering)));


    }

    catch (e) {
        console.log('we fucked up', e.message)
    }
}

module.exports = {
    syncAndSeed,
    Product,
    Company,
    Offering
}