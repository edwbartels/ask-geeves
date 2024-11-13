import random

existing = set()
follow_data_list = []

while len(follow_data_list) < 200:
    followed_by_id = random.randint(1, 25)
    following_id = random.randint(1, 25)

    follow_key = (followed_by_id, following_id)
    if follow_key not in existing:
        follow = {"followed_by_id": followed_by_id, "following_id": following_id}
        follow_data_list.append(follow)
        existing.add(follow_key)
