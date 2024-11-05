# Stack Overflow Replica
## Database Schema Design




### Table: Users
```sql
Table users {
  id int [pk, increment, not null] -- auto-increment primary key, required
  first_name varchar [not null] -- required
  last_name varchar [not null] -- required
  email varchar [unique, not null] -- unique, required
  username varchar [unique, not null] -- unique, required
  hashed_password varchar [not null] -- required
  created_at datetime [not null, default: 'datetime.now(timezone.utc)'] -- required
  updated_at datetime [not null, default: 'datetime.now(timezone.utc)'] -- required
}
```

### Table: Questions
```sql
Table questions {
  id int [pk, increment, not null] -- auto-increment primary key, required
  user_id int [ref: > users.id, not null] -- foreign key (users), required
  content varchar [not null] -- required
  total_score int [not null, default: 0] -- required, .update_total_score()
  created_at datetime [not null, default: 'datetime.now(timezone.utc)'] -- required
  updated_at datetime [not null, default: 'datetime.now(timezone.utc)'] -- required
 }
```
### Table: Answers
```sql
 Table comments {
  id int [pk, increment, not null] -- auto-increment primary key, required
  user_id int [ref: > users.id, not null] -- foreign key (users), required
  question_id int [ref: > questions.id, not null] -- foreign key (questions), required
  content varchar [not null] -- required
  accepted boolean [not null, default: false]
  total_score int [not null, default: 0] -- required, .update_total_score()
  created_at datetime [not null, default: 'datetime.now(timezone.utc)'] -- required
  updated_at datetime [not null, default: 'datetime.now(timezone.utc)'] -- required
 }
```

### Table: Comments
```sql
Table comments {
  id int [pk, increment, not null]-- auto-increment primary key, required
  user_id int [ref: > users.id, not null] -- foreign key (users), required
  content varchar [not null]
  content_id int [not_null]
  content_type varchar [not null] -- 'question' or 'answer'
  total_score int [not null, default: 0] -- required, .update_total_score()
  created_at datetime [not null, default: 'datetime.now(timezone.utc)']
  updated_at datetime [not null, default: 'datetime.now(timezone.utc)']
}
 ```

### Table: Saves
```sql
Table saves {
    id int [pk, increment, not null] -- auto-increment primary key, required
    user_id int [ref: > users.id, not null] -- foreign key (users), required
    content_type varchar [not null] -- required, 'question' or 'answer' or 'comment'
    content_id int -- required foreign_key question.id or answer.id or comment.id

    indexes {
      (user_id, content_type, content_id)
    }
  }
```
### Table: Tags
```sql
 Table tags {
  id int [pk, increment, not null] -- autoincrement primary key, required
  name varchar [unique, not null] -- unique, required
 }
```
### Table: Votes
```sql
Table votes {
  id int [pk, increment, not null] -- autoincrement primary key, required
  user_id int [ref: > users.id, not null] -- foreign key (users), required
  value int [not null] -- -1 or 0 or 1
  content_id int -- required foreign_key question.id or answer.id or comment.id
  content_type varchar [not null] -- 'question' or 'answer' or 'comment'
  
  indexes {
    (user_id, content_id, content_type)
  }
 }
```
### Join-Table: Questions<>Tags
```sql
 Table question_tags {
  question_id int [ref: > questions.id, not null] -- foreign key (questions), required
  tag_id int [ref: > tags.id, not null] -- foreign key (tags), required

  indexes {
  (question_id, tag_id) [unique]
  }
 }
 ```