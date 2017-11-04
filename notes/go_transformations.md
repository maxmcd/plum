# Go Transformations

Variable assigment
```go
config = config.WithRegion(region)
```

Conditional
```go
config = config.WithRegion(region)
// =>
if true {
    config = config.WithRegion(region)
}
```

Variable Declaration
```go
var err error

err := foo
```

Return something
```go
return c.RawRegion
```

