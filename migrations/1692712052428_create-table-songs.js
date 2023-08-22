/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("songs", {
        id: {
            type: "varchar(255)",
            primaryKey: true
        },
        title: {
            type: "varchar(50)",
            notNull: true
        },
        year: {
            type: "integer",
            notNull: true
        },
        performer: {
            type: "varchar",
            notNull: true
        }
    })
};

exports.down = pgm => {};
