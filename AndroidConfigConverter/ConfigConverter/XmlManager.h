#ifndef _XMLMANAGER_H_
#define _XMLMANAGER_H_
#include <QDomDocument>
#include <vector>
using namespace std;

class Configconverter;
class XmlManager;
class XmlNode
{
public:
	XmlNode();
	XmlNode(XmlManager *xmlManager, const char* nodeName, const char* attributeName, const char* attributeValue, const char* nodeText);
	~XmlNode();

	QDomElement getNode(){return m_domNode;}
	void appendChild(XmlNode* node);
	void addAttribute(const char* name, const char* attribute);
public:
	vector<XmlNode*> m_childNodes;
protected:
private:
	QDomElement  m_domNode;

	void freeNode(XmlNode* node);
	
};

class XmlManager
{
public:
	XmlManager(const char* rootName);
	XmlManager(Configconverter* converter, const char* rootName, const char* attributeName, const char* attributeValue, const char* type, const char* typeNodeName, const char* id, const char* idName);
	~XmlManager();

	QDomDocument  document(){return m_domDocment;}
	XmlNode*  root(){return m_pRootNode;}
	void setRootNote(XmlNode* node){m_pRootNode = NULL;}

	QDomElement createElem(const char* nodeName, const char* attributeName, const char* attributeValue, const char* nodeText);
	void setRootAttribute(const char* attributeName, const char *attributeValue);
	void saveAsFile(QString filename);
private:
	QDomDocument  m_domDocment;
	XmlNode*  m_pRootNode;
	Configconverter* m_pConverter;
private:
	void initXmlManager();
};

#endif