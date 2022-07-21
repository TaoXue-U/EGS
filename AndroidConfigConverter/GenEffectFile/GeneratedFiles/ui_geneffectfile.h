/********************************************************************************
** Form generated from reading UI file 'geneffectfile.ui'
**
** Created by: Qt User Interface Compiler version 5.2.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_GENEFFECTFILE_H
#define UI_GENEFFECTFILE_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_GenEffectFileClass
{
public:
    QWidget *centralWidget;
    QGroupBox *groupBox;
    QPushButton *openfileBtn;
    QPushButton *saveBtn;
    QPushButton *startBtn;
    QLineEdit *openDirlineEdit;
    QLineEdit *saveDirLineEdit;
    QLineEdit *versionedit;
    QPushButton *versionBtn;
    QMenuBar *menuBar;
    QToolBar *mainToolBar;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *GenEffectFileClass)
    {
        if (GenEffectFileClass->objectName().isEmpty())
            GenEffectFileClass->setObjectName(QStringLiteral("GenEffectFileClass"));
        GenEffectFileClass->resize(557, 379);
        centralWidget = new QWidget(GenEffectFileClass);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        groupBox = new QGroupBox(centralWidget);
        groupBox->setObjectName(QStringLiteral("groupBox"));
        groupBox->setGeometry(QRect(30, 10, 481, 291));
        openfileBtn = new QPushButton(groupBox);
        openfileBtn->setObjectName(QStringLiteral("openfileBtn"));
        openfileBtn->setGeometry(QRect(350, 40, 81, 31));
        saveBtn = new QPushButton(groupBox);
        saveBtn->setObjectName(QStringLiteral("saveBtn"));
        saveBtn->setGeometry(QRect(350, 100, 81, 31));
        startBtn = new QPushButton(groupBox);
        startBtn->setObjectName(QStringLiteral("startBtn"));
        startBtn->setGeometry(QRect(340, 220, 111, 41));
        openDirlineEdit = new QLineEdit(groupBox);
        openDirlineEdit->setObjectName(QStringLiteral("openDirlineEdit"));
        openDirlineEdit->setGeometry(QRect(40, 40, 291, 31));
        saveDirLineEdit = new QLineEdit(groupBox);
        saveDirLineEdit->setObjectName(QStringLiteral("saveDirLineEdit"));
        saveDirLineEdit->setGeometry(QRect(40, 100, 291, 31));
        versionedit = new QLineEdit(groupBox);
        versionedit->setObjectName(QStringLiteral("versionedit"));
        versionedit->setGeometry(QRect(40, 150, 291, 31));
        versionBtn = new QPushButton(groupBox);
        versionBtn->setObjectName(QStringLiteral("versionBtn"));
        versionBtn->setGeometry(QRect(350, 150, 81, 31));
        GenEffectFileClass->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(GenEffectFileClass);
        menuBar->setObjectName(QStringLiteral("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 557, 23));
        GenEffectFileClass->setMenuBar(menuBar);
        mainToolBar = new QToolBar(GenEffectFileClass);
        mainToolBar->setObjectName(QStringLiteral("mainToolBar"));
        GenEffectFileClass->addToolBar(Qt::TopToolBarArea, mainToolBar);
        statusBar = new QStatusBar(GenEffectFileClass);
        statusBar->setObjectName(QStringLiteral("statusBar"));
        GenEffectFileClass->setStatusBar(statusBar);

        retranslateUi(GenEffectFileClass);

        QMetaObject::connectSlotsByName(GenEffectFileClass);
    } // setupUi

    void retranslateUi(QMainWindow *GenEffectFileClass)
    {
        GenEffectFileClass->setWindowTitle(QApplication::translate("GenEffectFileClass", "GenEffectFile", 0));
        groupBox->setTitle(QApplication::translate("GenEffectFileClass", "\346\211\271\351\207\217\346\211\223\345\214\205", 0));
        openfileBtn->setText(QApplication::translate("GenEffectFileClass", "\346\211\223\345\274\200\346\226\207\344\273\266\345\244\271", 0));
        saveBtn->setText(QApplication::translate("GenEffectFileClass", "\344\277\235\345\255\230\350\267\257\345\276\204", 0));
        startBtn->setText(QApplication::translate("GenEffectFileClass", "\345\274\200\345\247\213\350\275\254\346\215\242", 0));
        versionBtn->setText(QApplication::translate("GenEffectFileClass", "\347\211\210\346\234\254\346\226\207\344\273\266\350\267\257\345\276\204", 0));
    } // retranslateUi

};

namespace Ui {
    class GenEffectFileClass: public Ui_GenEffectFileClass {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_GENEFFECTFILE_H
