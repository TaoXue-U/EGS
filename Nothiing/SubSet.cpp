#include "stdio.h"

void print(char* charSet, bool *isSubsets, int len, int index)
{
	printf("第%d个子集是:{", index  + 1);
	for (int i=0; i<len; i++)
	{
		if(isSubsets[i])
			i == len - 1 ? printf("%c", charSet[i]) : printf("%c, ", charSet[i]);
	}
	printf("}\n");
}

bool printSubset(char* charSet, bool *isSubsets, int x, int len, bool isSubset)
{
	if(x < len)
	{
		if(x == len - 1)
		{
			static int index = 0;
			print(charSet, isSubsets, len, index);
			index++;
		}

		x++;
		isSubsets[x] = true;
		printSubset(charSet, isSubsets, x, len, true);
		isSubsets[x] = false;
		printSubset(charSet, isSubsets, x, len, false);
	}
	return true;
}

int main()
{
	char charSet[] = {'a', 'b', 'c'};
	bool isSubsets[] = {false, false, false};
	printSubset(charSet, isSubsets, -1, 3, true);
	getchar();
	return 1;
}