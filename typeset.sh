#!/usr/bin/env python3

from glob import glob
from subprocess import run
import os
import os.path as path

for filename in glob("chapters/**/*.markdown", recursive=True):
	output_filename = filename.replace("chapters/", "output/", 1)
	dirname = path.dirname(output_filename)
	os.makedirs(dirname, exist_ok=True)
	if filename.endswith(".markdown"):
		run(["pandoc", filename, "--template", "template.html", "--output", output_filename.replace(".markdown", ".html")])
	else:
		run(["cp", filename, output_filename])