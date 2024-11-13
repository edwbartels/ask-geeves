### Use the following syntax to access formatted date properties:

```self.created_at_<format>```

or

```self.updated_at_<format>```
```python
    # Accepted values for <format>

    short           # 08/07/2016
    my              # 08/16
    long            # Aug 07 2016
    long_suffix     # August 7th, 2016 
```
Do not use these when sorting. Use ```self.created_at```
Very easy to add more for any necessary use cases, lmk.