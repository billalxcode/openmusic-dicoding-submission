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
        genre: {
            type: "varchar",
            notNUll: true
        },
        performer: {
            type: "varchar",
            notNull: true
        },
        duration: {
            type: "integer",
            notNull: false
        },
        albumId: {
            type: "varchar(255)",
            references: "albums",
            onUpdate: "cascade",
            onDelete: "cascade",
            notNUll: false
        },
        createdAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        updatedAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    })
};

exports.down = pgm => {
    pgm.dropTable("songs")
};
