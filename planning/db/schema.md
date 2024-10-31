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
  created_at datetime [not null, default: 'datetime.utcnow'] -- required
}
```

### Table: Questions (posts)
```sql
Table questions {
  id int [pk, increment, not null] -- auto-increment primary key, required
  content varchar [not null] -- required
  created_at datetime [not null, default: 'datetime.utcnow'] -- required
  updated_at datetime [not null, default: 'datetime.utcnow'] -- required
  user_id int [ref: > users.id, not null] -- foreign key (users), required
 }
```
### Table: Comments
```sql
 Table comments {
  id int [pk, increment, not null] -- auto-increment primary key, required
  content varchar [not null] -- required
  created_at datetime [not null, default: 'datetime.utcnow'] -- required
  updated_at datetime [not null, default: 'datetime.utcnow'] -- required
  user_id int [ref: > users.id, not null] -- foreign key (users), required
  question_id int [ref: > questions.id, not null] -- foreign key (questions), required
 }
```

### Table: Saves
```sql
Table saves {
    id int [pk, increment, not null] -- auto-increment primary key, required
    content_type varchar [not null] -- required, ('post' or 'comment')
    content_id int -- required foreign_key (posts or comments)
    user_id int [ref: > users.id, not null] -- foreign key (users), required
  }
```
### Table: Topics
```sql
 Table topics {
  id int [pk, increment, not null] -- autoincrement primary key, required
  name varchar [unique, not null] -- unique, required
 }
```

### Join-Table: Questions<>Topics
```sql
 Table question_topics {
  question_id int [ref: > questions.id, not null] -- foreign key (questions), required
  topic_id int [ref: > topics.id, not null] -- foreign key (topics), required

  indexes {
  (question_id, topic_id) [unique]
  }
 }
 ```