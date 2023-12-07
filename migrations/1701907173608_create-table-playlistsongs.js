/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("playlistsongs", {
        id: {
            type: "VARCHAR(50)",
            notNull: true,
            primaryKey: true
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
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        },
        created_at: {
            type: "TEXT",
            notNull: true
        },
        updated_at: {
            type: "TEXT",
            notNull: true
        }
    })
};

exports.down = pgm => {
    pgm.dropTable("playlistsongs")
};
