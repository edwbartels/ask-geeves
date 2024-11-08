import random

user_ids = range(1, 26)
question_ids = range(1, 26)
answer_ids = range(1, 14)
comment_ids = range(1, 41)

content_types = {"question": question_ids, "answer": answer_ids, "comment": comment_ids}

existing_votes = set()
votes = []
while len(votes) < 200:
    user_id = random.choice(user_ids)
    content_type = random.choice(list(content_types.keys()))
    content_id = random.choice(list(content_types[content_type]))
    value = random.choice([-1, 0, 1])

    vote_key = (user_id, content_type, content_id)

    if vote_key not in existing_votes:
        vote = {
            "user_id": user_id,
            "content_type": content_type,
            "content_id": content_id,
            "value": value,
        }

        votes.append(vote)
        existing_votes.add(vote_key)
