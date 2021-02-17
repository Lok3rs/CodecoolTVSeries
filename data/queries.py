from data import data_manager
from psycopg2 import sql


def get_shows():
    return data_manager.execute_select('SELECT id, title FROM shows;')


def get_show_count():
    return data_manager.execute_select('SELECT count(*) FROM shows;')


def get_shows_like(phrase):
    return data_manager.execute_select(
    sql.SQL(f"""
        SELECT 
            shows.id,
            shows.title
        FROM shows
        WHERE shows.title ILIKE '%{phrase}%'
        ORDER BY shows.title
    """))


def get_shows_limited(order_by="rating", order="DESC", limit=0, offset=0):
    return data_manager.execute_select(
        sql.SQL("""
            SELECT
                shows.id,
                shows.title,
                shows.year,
                shows.runtime,
                to_char(shows.rating::float, '999.9') AS rating_string,
                string_agg(genres.name, ', ' ORDER BY genres.name) AS genres_list,
                shows.trailer,
                shows.homepage
            FROM shows
                JOIN show_genres ON shows.id = show_genres.show_id
                JOIN genres ON show_genres.genre_id = genres.id
            GROUP BY shows.id
            ORDER BY
                CASE WHEN %(order)s = 'ASC' THEN {order_by} END ASC,
                CASE WHEN %(order)s = 'DESC' THEN {order_by} END DESC
            LIMIT %(limit)s
            OFFSET %(offset)s;
        """
                ).format(order_by=sql.Identifier(order_by)),
        {"order": order, "limit": limit, "offset": offset}
    )


def get_show(id):
    return data_manager.execute_select("""
        SELECT
            shows.id,
            shows.title,
            shows.year,
            shows.runtime,
            to_char(shows.rating::float, '999.9') AS rating_string,
            string_agg(genres.name, ', ' ORDER BY genres.name) AS genres_list,
            shows.trailer,
            shows.homepage,
            shows.overview
        FROM shows
            JOIN show_genres ON shows.id = show_genres.show_id
            JOIN genres ON show_genres.genre_id = genres.id
        WHERE shows.id = %(id)s
        GROUP BY shows.id;
    """, {"id": id}, False)


def get_show_characters(id, limit=3):
    return data_manager.execute_select("""
        SELECT sc.id, character_name, name, birthday, death, biography
        FROM actors a
        JOIN show_characters sc on a.id = sc.actor_id
        WHERE show_id = %(id)s
        ORDER BY id
        LIMIT %(limit)s
    """, {"id": id, "limit": limit})


def get_show_seasons(id):
    return data_manager.execute_select("""
        SELECT *
        FROM shows
        JOIN seasons ON shows.id = seasons.show_id
        WHERE shows.id = %(id)s;
    """, {"id": id})


def create_user(username, password):
    return data_manager.execute_select(
        sql.SQL("""
        INSERT INTO users (username, password) 
        VALUES ('{}', '{}')
        """.format(username, password)))


def get_username(username):
    return data_manager.execute_select(
        sql.SQL("""
        SELECT username
        FROM public.users
        WHERE username='{}'
        """.format(username))
    )


def get_user(username):
    return data_manager.execute_select(
        sql.SQL("""
        SELECT username, password
        FROM public.users
        WHERE username='{}'
        """.format(username))
    )


def get_all_shows_info():
    return data_manager.execute_select(
        sql.SQL("""
        SELECT * 
        FROM shows
        ORDER BY title""")
    )


def get_episodes(season_id):
    return data_manager.execute_select(
        sql.SQL("""
        SELECT *
        FROM episodes
        WHERE season_id = {}
        ORDER BY id
        """.format(season_id))
    )


def get_episode_details(episode_id):
    return data_manager.execute_select(
        sql.SQL("""
        SELECT *
        FROM episodes
        WHERE id = {}
        """.format(episode_id))
    )[0]


def update_episode(episode_id, title, overview):
    return data_manager.execute_dml_statement(
        """
        UPDATE episodes
        SET title = %(title)s, overview = %(overview)s
        WHERE id = %(id)s
        """, {"title": title, "overview": overview, "id": episode_id}
    )

