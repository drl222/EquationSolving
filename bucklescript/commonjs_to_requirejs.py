import os

FIRST_LINE = "define(function(require, exports, module) {\n\n"
LAST_LINE = "\n\n});"
DIRECTORIES = ["runtime", "stdlib"]

for directory in DIRECTORIES:
	all_js = filter(lambda filename: filename.endswith(".js"), os.listdir(directory))

	for filename in all_js:
		#http://stackoverflow.com/questions/4454298/prepend-a-line-to-an-existing-file-in-python
		with open(directory+"/"+filename, 'r') as original:
			data = original.read()

		if data.startswith(FIRST_LINE) and data.endswith(LAST_LINE):
			#if already in correct format, ignore
			print(directory+"/"+filename + " is already in require.js format")
		else:
			with open(directory+"/"+filename, 'w') as modified:
				modified.write(FIRST_LINE)
				modified.write(data)
				modified.write(LAST_LINE)