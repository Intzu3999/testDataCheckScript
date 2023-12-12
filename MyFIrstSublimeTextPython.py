try:
    firstNumString = input("Try to get 100. Enter firstNum: ")
    while not firstNumString.isdigit():
        print("Invalid input. Please enter an integer.")
        firstNumString = input("Try to get 100. Enter firstNum: ")
    
    firstNum = int(firstNumString)
    
    secondNumString = input("Try to get 100. Enter secondNum: ")
    while not secondNumString.isdigit():
        print("Invalid input. Please enter an integer.")
        secondNumString = input("Try to get 100. Enter secondNum: ")
    
    secondNum = int(secondNumString)

except EOFError:
    firstNum = 94
    secondNum = 22
    print("EOFError: End of file reached unexpectedly.")
    print("Due to unexpected EOF error, let firstNum=", firstNum , "and secondNum=" , secondNum)



twoNumTotal = firstNum + secondNum
print("Your total number is = ", twoNumTotal)

moreOrLessThanHundred = twoNumTotal

if moreOrLessThanHundred > 100:
    # Loop to iterate moreOrLessThanHundred - 1, int n++, until 100, exit loop, and print int 
    n = 0
    while moreOrLessThanHundred > 100:
        moreOrLessThanHundred -= 1
        n += 1
    print(twoNumTotal , " - " , n , " = 100!")
elif moreOrLessThanHundred < 100:
    # Loop to iterate moreOrLessThanHundred + 1, int n++, until 100, exit loop, and print int n
    n = 0
    while moreOrLessThanHundred < 100:
        moreOrLessThanHundred += 1
        n += 1
    print(twoNumTotal , " + " , n , " = 100!")
elif moreOrLessThanHundred == 100:
    print("Your firstNum + secondNum is equal to 100!")
