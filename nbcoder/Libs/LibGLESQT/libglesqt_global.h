#ifndef LIBGLESQT_GLOBAL_H
#define LIBGLESQT_GLOBAL_H

#include <QtCore/qglobal.h>

#ifdef LIBGLESQT_LIB
# define LIBGLESQT_EXPORT Q_DECL_EXPORT
#else
# define LIBGLESQT_EXPORT Q_DECL_IMPORT
#endif

#endif // LIBGLESQT_GLOBAL_H
