import random

existing = set()
question_tags_list = []

while len(question_tags_list) < 50:
    question_id = random.randint(1, 25)
    tag_id = random.randint(1, 31)

    tag_key = (question_id, tag_id)
    if tag_key not in existing:
        tag = {"question_id": question_id, "tag_id": tag_id}
        question_tags_list.append(tag)
        existing.add(tag_key)
