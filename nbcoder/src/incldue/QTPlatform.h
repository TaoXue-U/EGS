#ifndef _QTPLATFORM_H_
#define _QTPLATFORM_H_

#ifdef QT_OPENGL_ES_2
#include <QOpenGLFunctions_ES2>
#else
#include <QGLFunctions>
#endif

#include <qgl.h>

#endif // !_QTPLATFORM_H_
