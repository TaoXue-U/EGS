/********************************************************************************
** Form generated from reading UI file 'Configconverter.ui'
**
** Created by: Qt User Interface Compiler version 5.2.1
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_CONFIGCONVERTER_H
#define UI_CONFIGCONVERTER_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QComboBox>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLabel>
#include <QtWidgets/QLineEdit>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QPlainTextEdit>
#include <QtWidgets/QPushButton>
#include <QtWidgets/QStatusBar>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_ConfigconverterClass
{
public:
    QWidget *centralWidget;
    QPlainTextEdit *orgConfigText;
    QPlainTextEdit *dstConfigText;
    QLabel *label;
    QLabel *label_2;
    QPushButton *checkBtn;
    QPushButton *convertBtn;
    QGroupBox *groupBox;
    QPushButton *openfileBtn;
    QPushButton *saveBtn;
    QPushButton *startBtn;
    QLineEdit *openDirlineEdit;
    QLineEdit *saveDirLineEdit;
    QPushButton *startBorderBtn;
    QComboBox *typeCombox;
    QLabel *label_3;
    QMenuBar *menuBar;
    QToolBar *mainToolBar;
    QStatusBar *statusBar;

    void setupUi(QMainWindow *ConfigconverterClass)
    {
        if (ConfigconverterClass->objectName().isEmpty())
            ConfigconverterClass->setObjectName(QStringLiteral("ConfigconverterClass"));
        ConfigconverterClass->resize(867, 801);
        centralWidget = new QWidget(ConfigconverterClass);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        orgConfigText = new QPlainTextEdit(centralWidget);
        orgConfigText->setObjectName(QStringLiteral("orgConfigText"));
        orgConfigText->setGeometry(QRect(20, 50, 411, 311));
        dstConfigText = new QPlainTextEdit(centralWidget);
        dstConfigText->setObjectName(QStringLiteral("dstConfigText"));
        dstConfigText->setGeometry(QRect(440, 50, 411, 311));
        label = new QLabel(centralWidget);
        label->setObjectName(QStringLiteral("label"));
        label->setGeometry(QRect(150, 20, 71, 21));
        label_2 = new QLabel(centralWidget);
        label_2->setObjectName(QStringLiteral("label_2"));
        label_2->setGeometry(QRect(630, 20, 71, 21));
        checkBtn = new QPushButton(centralWidget);
        checkBtn->setObjectName(QStringLiteral("checkBtn"));
        checkBtn->setGeometry(QRect(730, 710, 121, 51));
        convertBtn = new QPushButton(centralWidget);
        convertBtn->setObjectName(QStringLiteral("convertBtn"));
        convertBtn->setGeometry(QRect(730, 370, 91, 31));
        groupBox = new QGroupBox(centralWidget);
        groupBox->setObjectName(QStringLiteral("groupBox"));
        groupBox->setGeometry(QRect(230, 410, 461, 311));
        openfileBtn = new QPushButton(groupBox);
        openfileBtn->setObjectName(QStringLiteral("openfileBtn"));
        openfileBtn->setGeometry(QRect(350, 40, 81, 31));
        saveBtn = new QPushButton(groupBox);
        saveBtn->setObjectName(QStringLiteral("saveBtn"));
        saveBtn->setGeometry(QRect(350, 100, 81, 31));
        startBtn = new QPushButton(groupBox);
        startBtn->setObjectName(QStringLiteral("startBtn"));
        startBtn->setGeometry(QRect(180, 220, 111, 41));
        openDirlineEdit = new QLineEdit(groupBox);
        openDirlineEdit->setObjectName(QStringLiteral("openDirlineEdit"));
        openDirlineEdit->setGeometry(QRect(40, 40, 291, 31));
        saveDirLineEdit = new QLineEdit(groupBox);
        saveDirLineEdit->setObjectName(QStringLiteral("saveDirLineEdit"));
        saveDirLineEdit->setGeometry(QRect(40, 100, 291, 31));
        startBorderBtn = new QPushButton(groupBox);
        startBorderBtn->setObjectName(QStringLiteral("startBorderBtn"));
        startBorderBtn->setGeometry(QRect(320, 220, 111, 41));
        typeCombox = new QComboBox(groupBox);
        typeCombox->setObjectName(QStringLiteral("typeCombox"));
        typeCombox->setGeometry(QRect(40, 150, 291, 41));
        label_3 = new QLabel(groupBox);
        label_3->setObjectName(QStringLiteral("label_3"));
        label_3->setGeometry(QRect(360, 170, 54, 12));
        ConfigconverterClass->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(ConfigconverterClass);
        menuBar->setObjectName(QStringLiteral("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 867, 23));
        ConfigconverterClass->setMenuBar(menuBar);
        mainToolBar = new QToolBar(ConfigconverterClass);
        mainToolBar->setObjectName(QStringLiteral("mainToolBar"));
        ConfigconverterClass->addToolBar(Qt::TopToolBarArea, mainToolBar);
        statusBar = new QStatusBar(ConfigconverterClass);
        statusBar->setObjectName(QStringLiteral("statusBar"));
        ConfigconverterClass->setStatusBar(statusBar);

        retranslateUi(ConfigconverterClass);

        QMetaObject::connectSlotsByName(ConfigconverterClass);
    } // setupUi

    void retranslateUi(QMainWindow *ConfigconverterClass)
    {
        ConfigconverterClass->setWindowTitle(QApplication::translate("ConfigconverterClass", "Configconverter", 0));
        label->setText(QApplication::translate("ConfigconverterClass", "  \345\216\237\351\205\215\347\275\256", 0));
        label_2->setText(QApplication::translate("ConfigconverterClass", "\350\275\254\346\215\242\351\205\215\347\275\256", 0));
        checkBtn->setText(QApplication::translate("ConfigconverterClass", "\346\243\200\346\237\245\351\205\215\347\275\256\346\226\207\344\273\266\346\240\274\345\274\217", 0));
        convertBtn->setText(QApplication::translate("ConfigconverterClass", "\345\274\200\345\247\213\350\275\254\346\215\242", 0));
        groupBox->setTitle(QApplication::translate("ConfigconverterClass", "\346\211\271\351\207\217\350\275\254\346\215\242", 0));
        openfileBtn->setText(QApplication::translate("ConfigconverterClass", "\346\211\223\345\274\200\346\226\207\344\273\266\345\244\271", 0));
        saveBtn->setText(QApplication::translate("ConfigconverterClass", "\344\277\235\345\255\230\350\267\257\345\276\204", 0));
        startBtn->setText(QApplication::translate("ConfigconverterClass", "\345\274\200\345\247\213\350\275\254\346\215\242\357\274\210\347\211\271\346\225\210\357\274\211", 0));
        startBorderBtn->setText(QApplication::translate("ConfigconverterClass", "\345\274\200\345\247\213\350\275\254\346\215\242\357\274\210\350\276\271\346\241\206\357\274\211", 0));
        typeCombox->clear();
        typeCombox->insertItems(0, QStringList()
         << QApplication::translate("ConfigconverterClass", "aaa", 0)
         << QApplication::translate("ConfigconverterClass", "\346\226\260\345\273\272\351\241\271\347\233\256", 0)
         << QApplication::translate("ConfigconverterClass", "\346\226\260\345\273\272\351\241\271\347\233\256", 0)
        );
        label_3->setText(QApplication::translate("ConfigconverterClass", "\351\200\211\346\213\251\347\261\273\345\236\213", 0));
    } // retranslateUi

};

namespace Ui {
    class ConfigconverterClass: public Ui_ConfigconverterClass {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_CONFIGCONVERTER_H
