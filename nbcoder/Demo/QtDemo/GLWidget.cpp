#include "GlWidget.h"
#include "Mainwindow.h"
#include "ShaderOperator.h"
#include "ModalInterface.h"
#include "ColorTriangle.h"

const char* vsCode = "attribute vec3 v3Position;void main(void){gl_Position = vec4(v3Position, 1.0);}";
const char* fsCode = "void main(void){gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);}";

GLWidget::GLWidget(QWidget* parent, Mainwindow* mainwindow) : QGLWidget(parent), m_vertexBuffer(0), m_pMainwindow(mainwindow)
{
	setAttribute(Qt::WA_PaintOnScreen);
	setAttribute(Qt::WA_NoSystemBackground);
	setAutoBufferSwap(false);

	colorTriangle = new ColorTriangle();
}

GLWidget::~GLWidget()
{
	colorTriangle->release();
}

void GLWidget::paintGL()
{
	glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glViewport(0, 0 , width(), height());

	
	m_pMainwindow->render();
	//colorTriangle->render();
	
	swapBuffers();
}

float sVertexDataCommon[9] = {-1.0f, 0.0f,  0.0f,0.0f, 1.0f, 0.0f,1.0f, 0.0f, 0.0f};
void GLWidget::initializeGL()
{
	glViewport(0,0,width(),height());
	glDisable(GL_DEPTH_TEST);
	printf("GL_INFO %s = %s\n", "GL_VERSION", glGetString(GL_VERSION));
	printf("GL_INFO %s = %s\n", "GL_VENDOR", glGetString(GL_VENDOR));
	printf("GL_INFO %s = %s\n", "GL_RENDERER", glGetString(GL_RENDERER));

	glClearColor(1.0f, 0.0f, 0.0f, 0.0f);
	glDisable(GL_DEPTH_TEST);

	glEnable(GL_BLEND);
	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

	colorTriangle->initProgram();
}


void GLWidget::resizeGL(int w, int h)
{

}


