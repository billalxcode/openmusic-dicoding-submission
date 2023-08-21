/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("albums", {
        id: 'id',
        name: {
            type: "varchar(255)",
            notNull: true
        },
        createdAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    })
};

exports.down = pgm => {
    pgm.dropTable("albums")
};
