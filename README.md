# resxtojson
Converts resx to JSON (with just a few dependencies).

Usage:

```
resxtojson MyApp*.resx resources
```

This will scan all resx files in the current folder and send the output to the
folder resources of the current folder.

Options:

-m, --regx-match <value>

Used to set a key pattern match for filtering resources, e.g.:

```
resxtojson -m \\bMyPrefix_.*\\b MyApp*.resx resources
```

Only resource keys starting with MyPrefix_ will be converted.
