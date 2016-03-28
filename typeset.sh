#!/usr/bin/env bash

for file in *.markdown; do
	pandoc "$file" --template template.html --output "output/${file%.markdown}.html"
done