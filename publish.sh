#!/usr/bin/env bash

### used for aelv
#
# publish_path=${PWD##*/}
# rsync --recursive --itemize-changes --compress --exclude=.git . aelv:~/public_html/$publish_path
# echo -n "http://aelv.se/pontus/$publish_path" | pbcopy


### static website

website_folder="../ManyTinyThings.github.io"

cp -r scripts/ $website_folder/scripts/
cp style.css $website_folder/style.css

for file in chapters/*.markdown; do
	chapter_file=${file##*/}
	chapter_name=${chapter_file%.markdown}
	chapter_folder=$website_folder/$chapter_name
	mkdir -p $chapter_folder
	pandoc "$file" --template template.html --output "$chapter_folder/index.html"
done