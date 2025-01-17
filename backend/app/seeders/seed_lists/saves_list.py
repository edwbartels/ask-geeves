import random

user_ids = range(1, 26)
question_ids = range(1, 26)
answer_ids = range(1, 14)
comment_ids = range(1, 41)

content_types = {"question": question_ids, "answer": answer_ids, "comment": comment_ids}

existing_saves = set()
saves = []

while len(saves) < 100:
    user_id = random.choice(user_ids)
    content_type = random.choice(list(content_types.keys()))
    content_id = random.choice(list(content_types[content_type]))

    save_key = (user_id, content_type, content_id)

    if save_key not in existing_saves:
        save = {
            "user_id": user_id,
            "content_type": content_type,
            "content_id": content_id,
        }
        if content_type == "comment":
            parent_type = random.choice(["question", "answer"])
            save["parent_type"] = parent_type

        saves.append(save)
        existing_saves.add(save_key)
