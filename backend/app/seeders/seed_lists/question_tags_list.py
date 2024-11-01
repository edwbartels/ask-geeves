import random

question_tags = [
    {"question_id": random.randint(1, 25), "tag_id": random.randint(1, 31)}
    for _ in range(50)
]

question_tags = list({(item["question_id"], item["tag_id"]) for item in question_tags})
question_tags_list = [{"question_id": x, "tag_id": y} for x, y in question_tags]
