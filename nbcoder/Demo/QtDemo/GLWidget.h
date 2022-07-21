#ifdef QT_OPENGL_ES_2
#include <QOpenGLFunctions_ES2>
#else
#include <QGLFunctions>
#endif

#include <qgl.h>
#include <QGLWidget>

class ShaderProgramOperator;
class BaseModal;
class ColorTriangle;
class Mainwindow;

class GLWidget : public QGLWidget
{
	Q_OBJECT
public:
	explicit GLWidget(QWidget* parent = NULL, Mainwindow* mainWindow = NULL);
	~GLWidget();

protected:
	void paintGL();
	void initializeGL();
	void resizeGL(int w, int h);

private:
	ShaderProgramOperator* m_program;
	BaseModal* baseModal;
	ColorTriangle* colorTriangle;

	GLuint m_posAttribLocation;
	GLuint m_vertexBuffer;

	Mainwindow* m_pMainwindow;


};