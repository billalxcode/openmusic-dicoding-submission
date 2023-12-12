/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("playlist_song_activities", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
            notNull: true
        },
        playlist_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: '"playlists"',
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        song_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: '"songs"',
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        user_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: '"users"',
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        action: {
            type: "VARCHAR(50)",
            notNull: true
        },
        time: {
            type: "TIMESTAMP",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('playlist_song_activities')
};
