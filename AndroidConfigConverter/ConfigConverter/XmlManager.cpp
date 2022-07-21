#include "XmlManager.h"
#include "Configconverter.h"
#include <QTextStream>
#include <QFile>

XmlManager::XmlManager(const char* rootName)
{
	//m_rootNode = m_domDocment.createElement(rootName);
	initXmlManager();
}

XmlManager::XmlManager(Configconverter* converter, const char* rootName, const char* attributeName, const char* attributeValue, const char* type, const char* typeName, const char* id, const char* idName)
	:m_pConverter(converter)
{

	m_pRootNode = new XmlNode(this, rootName, attributeName, attributeValue, NULL);
	m_pRootNode->addAttribute(type, typeName);
	m_pRootNode->addAttribute(id, idName);
	m_domDocment.appendChild(m_pRootNode->getNode());
	initXmlManager();
}

XmlManager::~XmlManager()
{
	m_pConverter = NULL;
}

void XmlManager::initXmlManager()
{

}

QDomElement XmlManager::createElem(const char* nodeName, const char* attributeName, const char* attributeValue, const char* nodeText)
{
	QDomElement ele = m_domDocment.createElement(nodeName);
	if(attributeName != NULL && attributeValue != NULL)
		ele.setAttribute(attributeName, attributeValue);
	if(nodeText != NULL){
		QDomText text = m_domDocment.createTextNode(nodeText);
		ele.appendChild(text);
	}

	return ele;
}

void XmlManager::setRootAttribute(const char* nodeName, const char* attributeValue)
{
	
}

void XmlManager::saveAsFile(QString filename)
{
	QFile file(filename);
	if (!file.open(QIODevice::WriteOnly | QIODevice::Truncate |QIODevice::Text))
		return ;
	QTextStream out(&file);
	out.setCodec("UTF-8");
	m_domDocment.save(out,4,QDomNode::EncodingFromTextStream);
	QString xml = m_domDocment.toString();
	m_pConverter->setDstNote(xml);
	file.close();
}














/////////////////////////////////////////////////////////////////////////////

XmlNode::XmlNode()
{

}

XmlNode::XmlNode(XmlManager* xmlManager, const char* nodeName, const char* attributeName, const char* attributeValue, const char* nodeText)
{
	//m_domNode = xmlManager->document().createElement(nodeName);
	//m_domNode.setAttribute(attributeName, attributeValue);
	//if(nodeText != NULL){
	//	QDomText text = xmlManager->document().createTextNode("001");
	//	m_domNode.appendChild(text);
	//}
	m_domNode = xmlManager->createElem(nodeName, attributeName, attributeValue, nodeText);
}

XmlNode::~XmlNode()
{
	//freeNode(this);
	m_childNodes.clear();
}

void XmlNode::freeNode(XmlNode* node)
{
	int size = node->m_childNodes.size();
	if(node->m_childNodes.size() != 0)
	{
		vector<XmlNode*> nodes = node->m_childNodes;
		for(vector<XmlNode*>::iterator iter= nodes.begin(); iter!=nodes.end(); ++iter)  
		{  
			nodes.erase(iter);
			freeNode(*iter);
		}  
	}
	else
	{
		delete node;
		node = NULL;
	}
}

void XmlNode::addAttribute(const char* name, const char* attribute)
{
	m_domNode.setAttribute(name, attribute);
}

void XmlNode::appendChild(XmlNode* node)
{
	m_childNodes.push_back(node);
	QDomElement domNode = node->getNode();
	m_domNode.appendChild(domNode);
}