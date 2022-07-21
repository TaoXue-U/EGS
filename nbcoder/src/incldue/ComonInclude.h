#ifndef _COMMONINCLUDE_H_
#define _COMMONINCLUDE_H_

#ifdef LIBGLESQT_LIB
#include "QTPlatform.h"
#endif // LIBGLESQT_LIB



#ifndef SHADER_STRING
#define SHADER_STRING(...) #__VA_ARGS__
#endif

#endif // !_COMMONINCLUDE_H_
