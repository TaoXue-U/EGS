#include "Mainwindow.h"
#include "GLWidget.h"
#include "test.h"
#include <cassert>
#include "ModalInterface.h"
#include "ColorTriangle.h"

#define cgeStaticAssert(value) static_assert(value, "Invalid Parameters!")

const char* btnItem[] = 
{
	"三角形",	//0
	"颜色三角形", //1
};

const int btnItemSize = sizeof(btnItem) / sizeof(*btnItem);

MunuButton::MunuButton(Mainwindow* mainwindow, int index, QWidget* parent) : 
	m_pMainwindow(mainwindow), m_index(index), QPushButton(parent)
{
	connect(this, SIGNAL(clicked()), SLOT(itemClick()));
}

MunuButton::~MunuButton()
{
		
}

void MunuButton::itemClick()
{
	m_pMainwindow->itemClicked(m_index);
}

Mainwindow::Mainwindow(QWidget *parent)
	: QMainWindow(parent),m_baseModal(NULL)
{
	ui.setupUi(this);
	initWidget();
}

Mainwindow::~Mainwindow()
{

}

void Mainwindow::resizeEvent(QResizeEvent *event)
{
	int w = this->width();
	int h = this->height();

	auto  sceneGeometry = ui.sceneWidget->geometry();
	ui.sceneWidget->setGeometry(sceneGeometry.x(), sceneGeometry.y(), w - sceneGeometry.x() - 100, h - sceneGeometry.y() - 100);
	sceneGeometry = ui.sceneWidget->geometry();
	m_glWidget->setGeometry(sceneGeometry);
}

void Mainwindow::initWidget()
{
	ui.sceneWidget->hide();
	m_glWidget = new GLWidget(this, this);
	initBtnItem();
}

void Mainwindow::initBtnItem()
{
	const int btnHeight = 30;
	QWidget *menuWidget = ui.menuWidget;

	m_scrollArea = new QScrollArea(ui.menuWidget);
	m_scrollArea->setGeometry(0, 0, menuWidget->width(), menuWidget->height());
	m_scrollArea->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
	m_scrollChildWidget = new QWidget(m_scrollArea);

	m_scrollChildWidget->setGeometry(0, 0, m_scrollArea->width() - 10, (btnHeight + 2) * (btnItemSize+1));

	for(int i = 0; i != btnItemSize; ++i)
	{
		MunuButton* btn = new MunuButton(this, i, m_scrollChildWidget);
		btn->setText(QString::fromLocal8Bit(btnItem[i]));
		btn->setGeometry(0 + 20, i * (btnHeight + 2) + 20, 140, btnHeight);
		btn->setFixedSize(140, btnHeight);
	}

	m_scrollArea->setWidget(m_scrollChildWidget);
}


void Mainwindow::itemClicked(int index)
{
	createModalObj(index);
}


void Mainwindow::triangleClick()
{
	Test test;
	printf("%d", test.add(1, 2));
}

void Mainwindow::createModalObj(int index)
{
	if(m_baseModal != NULL){
		delete m_baseModal;
		m_baseModal = NULL;
	}

	switch (index)
	{
	case 0:
		m_baseModal = new BaseModal();
		break;
	case 1:
		m_baseModal = new ColorTriangle();
		break;
	default:
		break;
	}

	if(m_baseModal != NULL){
		m_baseModal->initProgram();
		m_glWidget->update();
	}
}

void  Mainwindow::render()
{
	if(m_baseModal != NULL)
		m_baseModal->render();
}



