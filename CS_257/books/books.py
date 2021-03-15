'''
Author: Aiden Chang, Duc Nguyen
Revised by: Aiden Chang
Winter 2021, cs257
Code will contain arg parse commands. See usage.txt for details.
'''
import argparse, csv, sys


def get_parsed_args():
  parser = argparse.ArgumentParser(formatter_class=argparse.RawTextHelpFormatter) 
  '''for the newline characters RawTextHelpFormatter
  RawTextHelpFormatter inspired by some post in stack overflow'''
  group = parser.add_mutually_exclusive_group()
  
  group.add_argument("--title", "-t", help='''
  Example: python3 books.py -t "Mobi"
  Searches for and displays all books containing the string **book title**. The string is case sensitive. If you want to include space, put the string in quotation marks.
  '''
  , type = str, nargs = 1)
  '''Inspired by pythons argphase module'''

  group.add_argument("--author", "-a", help= '''
  Example: python3 books.py -a "Toni"
  Searches for and displays all authors containing the string **author name**. For each of those authors, every book by them is displayed. The string is case sensitive. If you want to include space, put the string in quotation marks.
  '''
  , type = str, nargs = 1)

  group.add_argument("--multi_search", "-ms", help = '''
  After the command is typed in, a prompt will appear and ask for the user input. 
  After the first prompt appears, type in the author's name you wish to search. Doing the same for the book title for the second prompt and the starting and ending year for the third prompt. 
  The input is case sensitive. Typing exit() will allow the user to abort the search and exit at any moment. Press Enter will allow the user to skip the current prompt. After all three prompts, all the books fitting all three criteria will be displayed.
  ''', action="store_true")

  group.add_argument("--year", "-y", help = '''
  Example: python3 books.py -y 1890 1900
  Searches for and displays all books published between the **start year** and the **end year** (inclusive). The **start year** must be smaller then the **end year**. 
  ''', type = int, nargs = 2  )

  
  parser.add_argument('--file', '-f', default='books.csv', help='the file to search for books')
  '''Get the file of to search in, default is books.csv'''
  args = parser.parse_args()
  return args

def build_books_list(search_file):
  """
  Get a list of books from the specify file

  Parameters:
    search_file: The file to search in.
  Returns:
    books_list: The list of books
  """

  with open(search_file, newline = '') as csvfile:
    reader = csv.reader(csvfile, delimiter= ',')
    books_list = []
    for row in reader:
      book = {}
      book["title"] = row[0]

      authors_with_years = row[2].split(" (")
      book["author"] = [authors_with_years[0]]
      if len(authors_with_years) > 2:
        '''There are some books that have 2 authors'''
        second_author = authors_with_years[1].split(' and ')[1]
        book["author"].append(second_author)

      book["published_year"] = int(row[1])

      books_list.append(book)
    return books_list

      
def get_books_matching_title(search_str, books_list):
  """
  Get a dictionary of books and their authors based on search string

  Parameters:
    search_str: String to search for(case-sensitive).
    books_list: The list of book to search in
  Returns:
    books_with_authors: A dictionary of books with their authors.
  """
  print("You search for books with " + search_str + " in their titles")

  books_with_authors = {}
  for book in books_list:
    '''Check if the book's title has search string'''
    if search_str in book["title"]:
      books_with_authors[book["title"]] = book["author"]
  return books_with_authors



def print_books_matching_title(books_with_authors):
  """
  Formatted the print result of the title query

  Parameters:
    books_with_authors: A dictionary of books with their authors
  """
  if len(books_with_authors) == 0:
    print("Sorry, there are no matches. Please check the spelling, capitalization, and spacing. Type --help for more information.", file=sys.stderr)
  for title in books_with_authors:
    print(title + " by " + ' and '.join(map(str, books_with_authors[title])))


def get_author_with_books(search_str, books_list):
  """
  Get a dictionary of books and their authors based on search string

  Parameters:
    search_str: String to search for(case-sensitive).
    books_list: The list of book to search in
  Returns:
    authors_with_books: A dictionary of authors with their books.
  """
  print("You search for authors with " + search_str + " in their names")

  authors_with_books = {}
  for book in books_list:
      for name in book["author"]:
        '''Check if the author's name has search string'''
        if search_str in name:
          if name not in authors_with_books:
            authors_with_books[name] = [book["title"]]
          else:
            authors_with_books[name].append(book["title"])
  return authors_with_books


def print_author_with_books(authors_with_books):
  """
  Formatted the print result of the author query

  Parameters:
    authors_with_books: A dictionary of authors with their books.
  """
  if len(authors_with_books) == 0:
    print("Sorry, there are no matches. Please check the spelling, capitalization, and spacing. Type --help for more information.", file=sys.stderr)
  for name in authors_with_books:
    print(name + " has written:")
    for book in authors_with_books[name]:
      print("   " + book)


def get_books_by_years(start_year, end_year, books_list):
  """
  Get a dictionary of books and their published based on a range of year

  Parameters:
    start_year: The lower bound of the search range.
    end_year: The upper bound of the search range.
    books_list: The list of books to search in
  Returns:
    books_with_years: A dictionary of books with their publised year.
  """
  print("You search for books published from " + str(start_year) + " to " + str(end_year))

  books_with_years = {}
  for book in books_list:
    if book["published_year"] >= int(start_year) and book["published_year"] <= int(end_year):
      books_with_years[book["title"]] = book["published_year"]
  return books_with_years


def print_books_by_years(books_with_years):
  """
  Formatted the print result of the published year query

  Parameters:
    books_with_years: A dictionary of books with their publised year.
  """

  if len(books_with_years) == 0:
    print("Sorry, there are no matches. Please check the spelling, capitalization, and spacing. Type --help for more information.", file=sys.stderr)
  for book in books_with_years:
    print(book, books_with_years[book])

def get_input_for_multi_search():
  """
  Get the input of the user to perform multisearch

  Return:
    user_input: a dictionary of type of user input
  """
  user_input = {"title":"","author":"","start_year":float('-inf'), "end_year":float('inf')}

  title = input("What is the title of the book? \n")
  if title == "_exit":
    sys.exit()
  else:
    user_input["title"] = title

  author = input("What is the author of the book?\n")
  if author == "_exit":
    sys.exit()
  else:
    user_input["author"] = author

  try:
    start_year =  input("Type in the lower bound of the published year.\n")
    if start_year == "_exit":
      sys.exit()
    elif start_year == '':
      pass
    else:
      user_input["start_year"] = int(start_year)
  except ValueError:
    '''Return error if the input is not integer'''
    print("Wrong input type. This section will be passed", file=sys.stderr)  

  try:
    end_year = input("Type in the upper bound of the published year.\n")
    if end_year == "_exit":
      sys.exit()
    elif end_year == '':
      pass
    else:
      user_input["end_year"] = int(end_year)

  except ValueError:
    '''Return error if the input is not integer'''
    print("Wrong input type. This section will be passed", file=sys.stderr)
  return user_input

def get_books_by_multi_search(user_input, books_list):
  """
  Get a list of books based on multiple characteristic

  Parameters:
    user_input: A dictionary based on what the user type input
    books_list: The list of book to search from
  Return:
    books_list_multisearch: The list of book after performing multisearch
  """
  books_list_multisearch = []
  for book in books_list:
    if (user_input["title"] in book["title"] and
    any(user_input["author"] in name for name in book["author"]) and
    user_input["start_year"] <= book["published_year"] and
    user_input["end_year"] >= book["published_year"]):
      books_list_multisearch.append(book)
  if len(books_list_multisearch) == len(books_list):
    books_list_multisearch = None
  return books_list_multisearch 


def print_books_by_multi_search(books_list_multisearch):
  """
  Formatted the print result of the multisearch query
  
  Parameters:
    books_list: The list of books to print out
  """

  if books_list_multisearch == None:
    print("You skip through all the section", file=sys.stderr)
  elif len(books_list_multisearch) == 0:
    print("Sorry, there are no matches. Please check the spelling, capitalization, and spacing. Type --help for more information.", file=sys.stderr)
  for book in books_list_multisearch:
    print(book["title"] + " published in " + str(book["published_year"]) + " by " + ' and '.join(map(str, book["author"])))

def main():
  parsed_args = get_parsed_args()
  books_list = build_books_list(parsed_args.file)

  if (parsed_args.title != None):
    books_with_authors = get_books_matching_title(parsed_args.title[0], books_list)
    print_books_matching_title(books_with_authors)

  elif (parsed_args.author != None):
    authors_with_books = get_author_with_books(parsed_args.author[0], books_list)
    print_author_with_books(authors_with_books)

  elif (parsed_args.year != None):
    if (parsed_args.year[0] > parsed_args.year[1]):
      print("The range of year you enter is not valid", file=sys.stderr)
    else:
      books_with_years = get_books_by_years(parsed_args.year[0], parsed_args.year[1],books_list)
      print_books_by_years(books_with_years)
  elif (parsed_args.multi_search == True):
    user_input = get_input_for_multi_search()
    books_list = get_books_by_multi_search(user_input, books_list)
    print_books_by_multi_search(books_list)
  else:
    print("You do not specify any arguments. Type --help for more information.", file=sys.stderr)
if __name__ == '__main__':
	main()