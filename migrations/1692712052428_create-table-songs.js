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
        album_id: {
            type: "varchar(255)",
            references: "albums",
            onUpdate: "cascade",
            onDelete: "cascade",
            notNUll: false
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
    pgm.dropTable("songs")
};
