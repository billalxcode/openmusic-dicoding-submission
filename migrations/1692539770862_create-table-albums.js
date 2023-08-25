/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("albums", {
        id: {
            type: "varchar(255)",
            primaryKey: true
        },
        name: {
            type: "varchar(255)",
            notNull: true
        },
        year: {
            type: "integer",
            notNull: true,
        },
        created_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        updated_at: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    })
};

exports.down = pgm => {
    pgm.dropTable("albums")
};
